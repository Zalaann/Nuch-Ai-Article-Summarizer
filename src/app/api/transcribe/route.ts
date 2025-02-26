import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import https from 'https';
import fs from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// Initialize OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  httpAgent: new https.Agent({
    keepAlive: true,
    timeout: 120000, // 2 minutes timeout
  }),
});

export async function POST(request: Request) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing OpenAI API key' },
        { status: 500 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get('file') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Create a temporary file to store the audio
    const tempFilePath = join(tmpdir(), `audio-${Date.now()}.${audioFile.name.split('.').pop()}`);
    
    // Convert the file to a buffer and write it to the temporary file
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    fs.writeFileSync(tempFilePath, buffer);

    try {
      // Transcribe the audio using OpenAI's Whisper API
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
      });

      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);

      if (!transcription.text) {
        return NextResponse.json(
          { error: 'Failed to transcribe audio: No text returned from Whisper API' },
          { status: 500 }
        );
      }

      return NextResponse.json({ transcription: transcription.text });
    } catch (error: any) {
      // Clean up the temporary file in case of error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      console.error('OpenAI API error:', error);
      
      // Handle specific OpenAI API errors
      if (error.response) {
        // Check for rate limit errors
        if (error.response.status === 429 || (error.response.data?.error?.message && error.response.data.error.message.includes('rate limit'))) {
          return NextResponse.json(
            { 
              error: 'OpenAI API rate limit exceeded. Please try again in a few minutes.',
              rate_limited: true 
            },
            { status: 429 }
          );
        }
        
        return NextResponse.json(
          { error: `OpenAI API error: ${error.response.data?.error?.message || 'Unknown error'}` },
          { status: error.response.status || 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to transcribe audio: ' + (error.message || 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in transcribe API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 