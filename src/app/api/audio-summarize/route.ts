import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import https from 'https';
import fs from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import FormData from 'form-data';
import axios from 'axios';

// Initialize OpenAI client with the API key from environment variables and custom configuration
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY) {
    // Create a custom HTTPS agent with keep-alive enabled and longer timeout
    const httpsAgent = new https.Agent({ 
      keepAlive: true,
      timeout: 300000, // 5 minutes
      rejectUnauthorized: true
    });
    
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 5,
      timeout: 300000, // 5 minutes timeout
      httpAgent: httpsAgent,
    });
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

// Helper function to implement retry logic with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5, initialDelay = 2000): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${attempt + 1}/${maxRetries} failed:`, error);
      lastError = error;
      
      // Check if this is a rate limit error (429)
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isRateLimit = errorMessage.includes('429') || errorMessage.includes('rate limit');
      
      // Don't retry on rate limit errors - these should be handled by the caller
      if (isRateLimit) {
        throw error;
      }
      
      // Only wait if we're going to retry
      if (attempt < maxRetries - 1) {
        // Use a much longer delay for rate limit errors
        const baseDelay = initialDelay;
        
        // Calculate delay with exponential backoff and jitter
        const delay = baseDelay * Math.pow(2, attempt) * (0.9 + Math.random() * 0.2);
        
        console.log(`Retrying in ${Math.round(delay / 1000)} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Define the transcription type
interface WhisperTranscription {
  text: string;
  [key: string]: any; // For any other properties that might be returned
}

export async function POST(request: Request) {
  // Create a temporary file path that we'll use and clean up
  let tempFilePath = '';
  
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const title = formData.get('title') as string || 'Audio Recording';
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // Verify API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing OpenAI API key. Please add your OpenAI API key to the .env.local file.' },
        { status: 500 }
      );
    }

    // Check file size - warn if it's large
    const fileSizeMB = audioFile.size / (1024 * 1024);
    console.log(`Processing audio file: ${audioFile.name}, Size: ${fileSizeMB.toFixed(2)} MB`);
    
    if (fileSizeMB > 20) {
      console.warn(`Warning: Large file size (${fileSizeMB.toFixed(2)} MB) may cause connection issues`);
    }

    // Step 1: Transcribe the audio using OpenAI's Whisper API with retry logic
    let transcription: WhisperTranscription;
    try {
      // Convert the file to a buffer
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Create a temporary file
      const fileExt = audioFile.name.split('.').pop() || 'wav';
      tempFilePath = join(tmpdir(), `audio-${Date.now()}.${fileExt}`);
      fs.writeFileSync(tempFilePath, buffer);
      
      // COMPLETELY DIFFERENT APPROACH: Use a direct HTTP request with minimal dependencies
      // This bypasses any potential issues with the OpenAI SDK or axios
      
      console.log("Attempting transcription with minimal HTTP request...");
      
      // Create a form data instance for the file upload
      const form = new FormData();
      form.append('file', fs.createReadStream(tempFilePath));
      form.append('model', 'whisper-1');
      form.append('response_format', 'json');
      
      // Use a promise-based approach with the native https module
      transcription = await new Promise<WhisperTranscription>((resolve, reject) => {
        const request = https.request(
          {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/audio/transcriptions',
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              ...form.getHeaders()
            },
            timeout: 300000, // 5 minutes
            agent: new https.Agent({
              keepAlive: true,
              timeout: 300000,
              rejectUnauthorized: true
            })
          },
          (response) => {
            // Handle the response
            if (response.statusCode !== 200) {
              reject(new Error(`API returned status code ${response.statusCode}`));
              return;
            }
            
            const chunks: Buffer[] = [];
            response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            response.on('end', () => {
              const body = Buffer.concat(chunks).toString();
              try {
                resolve(JSON.parse(body));
              } catch (error) {
                reject(new Error(`Failed to parse response: ${body.substring(0, 100)}...`));
              }
            });
          }
        );
        
        // Handle request errors
        request.on('error', (error) => {
          console.error('Request error:', error);
          reject(error);
        });
        
        // Handle timeout
        request.on('timeout', () => {
          request.destroy();
          reject(new Error('Request timed out'));
        });
        
        // Send the form data
        form.pipe(request);
      });
    } catch (error) {
      console.error('OpenAI Whisper API error:', error);
      
      // Check for specific network errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Provide more specific error messages based on the error
      if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        console.error('OpenAI API rate limit exceeded:', errorMessage);
        return NextResponse.json(
          { 
            error: 'OpenAI API rate limit exceeded. Please try again in a few minutes or consider upgrading your OpenAI API plan for higher limits. If this error persists, contact support.',
            rate_limited: true 
          },
          { status: 429 }
        );
      }
      
      if (errorMessage.includes('ECONNRESET')) {
        return NextResponse.json(
          { error: 'Connection reset by server. This is often due to network instability or server load. Try using a smaller audio file or try again later.' },
          { status: 503 }
        );
      }
      
      if (errorMessage.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out. The audio file might be too large or your network connection might be unstable. Try using a smaller audio file.' },
          { status: 504 }
        );
      }
      
      if (errorMessage.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key. Please check your API key in the .env.local file.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to transcribe audio. Please try again later. Error: ' + errorMessage },
        { status: 500 }
      );
    } finally {
      // Clean up the temporary file if it exists
      if (tempFilePath) {
        try {
          fs.unlinkSync(tempFilePath);
          console.log("Temporary file cleaned up successfully");
        } catch (error) {
          console.error('Error cleaning up temporary file:', error);
        }
      }
    }

    if (!transcription || !transcription.text) {
      return NextResponse.json(
        { error: 'Failed to transcribe audio: No text returned from Whisper API' },
        { status: 500 }
      );
    }

    console.log("Transcription successful! Length:", transcription.text.length);

    // Step 2: Summarize the transcription using OpenAI's GPT model
    // Create a standard prompt for summarization
    const prompt = `Please create a concise summary of the following transcribed audio titled "${title}". 
    Focus on the key points and main ideas.
    
    Transcription: ${transcription.text}`;

    // Call OpenAI's GPT model for summarization with retry logic
    try {
      const completion = await withRetry(async () => {
        return await openai!.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });
      }, 5, 2000); // 5 retries with 2 second initial delay

      const summary = completion.choices[0]?.message?.content || '';
      
      if (!summary) {
        console.error('OpenAI API returned no summary content:', completion);
        return NextResponse.json(
          { 
            error: 'OpenAI API returned no summary content.',
            transcription: transcription.text // Return the transcription even if summarization fails
          },
          { status: 500 }
        );
      }

      console.log("Summary generation successful! Length:", summary.length);

      return NextResponse.json({ 
        transcription: transcription.text,
        summary 
      });
    } catch (error) {
      console.error('OpenAI GPT API error:', error);
      
      // Check for specific network errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('ECONNRESET') || errorMessage.includes('Connection error')) {
        return NextResponse.json(
          { 
            error: 'Network connection error when contacting OpenAI. Please check your internet connection and try again.',
            transcription: transcription.text // Return the transcription even if summarization fails
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to generate summary. Please try again later.',
          transcription: transcription.text // Return the transcription even if summarization fails
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in audio-summarize API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during audio summarization: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  } finally {
    // Clean up the temporary file if it exists (redundant cleanup as a safety measure)
    if (tempFilePath) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (error) {
        // Ignore errors here as we might have already cleaned up in the inner try-catch
      }
    }
  }
} 