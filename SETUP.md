# Nuch Summarizer Setup Guide

This guide will help you set up and run the Nuch Summarizer application.

## Prerequisites

1. Node.js (v16 or higher)
2. npm or yarn
3. Supabase account
4. OpenAI API key

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Open the `.env.local` file in the root directory
2. Replace the placeholder values with your actual credentials:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key
```

#### Where to find these values:

- **Supabase URL and Anon Key**: 
  - Log in to your Supabase account
  - Go to your project
  - Navigate to Project Settings > API
  - Copy the "Project URL" and "anon public" key

- **OpenAI API Key**:
  - Log in to your OpenAI account
  - Go to https://platform.openai.com/api-keys
  - Create a new API key or use an existing one

### 3. Set Up Supabase Database

The application requires two tables in your Supabase database:

#### Articles Table
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  content TEXT,
  summary TEXT,
  summary_percentage INTEGER,
  summary_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own articles
CREATE POLICY "Users can only see their own articles" 
ON articles FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own articles
CREATE POLICY "Users can insert their own articles" 
ON articles FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

#### Audio Summaries Table
```sql
CREATE TABLE audio_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  transcription TEXT,
  summary TEXT,
  summary_percentage INTEGER,
  summary_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE audio_summaries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own audio summaries
CREATE POLICY "Users can only see their own audio summaries" 
ON audio_summaries FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own audio summaries
CREATE POLICY "Users can insert their own audio summaries" 
ON audio_summaries FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

You can run these SQL commands in the Supabase SQL Editor.

### 4. Run the Application

```bash
npm run dev
```

The application should now be running at http://localhost:3000.

## Troubleshooting

### API Key Issues
- If you see errors related to OpenAI API keys, make sure your API key is valid and has sufficient credits.
- For Supabase connection issues, verify that your URL and anon key are correct.

### Database Issues
- If you encounter database errors, check that your tables are set up correctly with the proper columns and permissions.

### Audio Processing Issues
- For audio processing problems, ensure that your OpenAI account has access to the Whisper API.
- Check that the audio file format is supported (MP3, WAV, M4A, etc.).

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Next.js Documentation](https://nextjs.org/docs) 