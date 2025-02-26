import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import https from 'https';

// OpenAI API setup
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Create OpenAI client with custom HTTPS agent for better connection handling
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  httpAgent: new https.Agent({
    keepAlive: true,
    timeout: 120000, // 2 minutes timeout
  }),
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { article, title, summaryPercentage, summaryType } = await request.json();

    // Validate inputs
    if (!article || !summaryPercentage) {
      return NextResponse.json(
        { error: 'Article text and summary percentage are required' },
        { status: 400 }
      );
    }

    // Verify API key is available
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing OpenAI API key. Please add your OpenAI API key to the .env.local file.' },
        { status: 500 }
      );
    }

    // Calculate target length based on percentage (10-90%)
    const percentage = Math.min(Math.max(summaryPercentage, 10), 90);
    const targetLength = Math.ceil((article.split(' ').length * percentage) / 100);

    // Create prompt based on summary type
    let prompt = '';
    
    if (summaryType === 'concise') {
      prompt = `Please create a concise summary of the following ${title ? `article titled "${title}"` : 'article'}. 
      Focus on the key points and main ideas. 
      Aim for approximately ${targetLength} words.
      
      Article: ${article}`;
    } else if (summaryType === 'bullets') {
      prompt = `Please create a bullet-point summary of the following ${title ? `article titled "${title}"` : 'article'}. 
      Focus on the key points and main ideas.
      Use 5-10 bullet points.
      
      Article: ${article}`;
    } else {
      // Default to comprehensive
      prompt = `Please create a comprehensive summary of the following ${title ? `article titled "${title}"` : 'article'}. 
      Include all important details, key arguments, and conclusions.
      Aim for approximately ${targetLength} words.
      
      Article: ${article}`;
    }

    // Call OpenAI API for summarization
    try {
      const response = await openai.chat.completions.create({
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

      // Extract the summary from the response
      const summary = response.choices[0]?.message?.content || '';
      
      if (!summary) {
        console.error('OpenAI API returned no summary content:', response);
        return NextResponse.json(
          { error: 'Failed to generate summary: No content returned from OpenAI API' },
          { status: 500 }
        );
      }

      return NextResponse.json({ summary });
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      // Handle specific OpenAI API errors
      if (error.response) {
        // Check for rate limit errors
        if (error.response.status === 429 || (error.response.data?.error?.message && error.response.data.error.message.includes('rate limit'))) {
          return NextResponse.json(
            { 
              error: 'OpenAI API rate limit exceeded. Please try again in a few minutes or consider upgrading your OpenAI API plan for higher limits.',
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
      
      // Handle network errors
      if (error.message && (error.message.includes('ECONNRESET') || error.message.includes('network'))) {
        return NextResponse.json(
          { error: 'Network connection error when contacting OpenAI. Please check your internet connection and try again.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to connect to OpenAI API. Please check your internet connection and try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in summarize API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 