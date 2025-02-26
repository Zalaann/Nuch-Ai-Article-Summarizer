'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const NewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const AudioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
)

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const AIEnhancementsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v6H9z" />
  </svg>
)

// Add menu icons for mobile navigation
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function AudioSummarizationPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [summary, setSummary] = useState('')
  const [transcription, setTranscription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [retryCountdown, setRetryCountdown] = useState(0)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Add countdown timer for rate limit errors
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isRateLimited && retryCountdown > 0) {
      timer = setInterval(() => {
        setRetryCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer as NodeJS.Timeout);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRateLimited, retryCountdown]);

  // Add click outside handler for mobile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && showMobileMenu) {
        setShowMobileMenu(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMobileMenu])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/sign-in')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      
      // Warn if file is large
      if (fileSizeMB > 10) {
        setError(`Warning: Large file (${fileSizeMB.toFixed(2)} MB) may cause connection issues. Consider using a smaller file (under 10MB) for better reliability.`);
      } else {
        setError(null);
      }
      
      setAudioFile(file)
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      // Reset states when a new file is uploaded
      setSummary('')
      setTranscription('')
      setSuccessMessage(null)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        
        // Create a File object from the Blob
        const file = new File([audioBlob], "recording.wav", { type: 'audio/wav' });
        setAudioFile(file);
        
        // Reset states
        setSummary('');
        setTranscription('');
        setError(null);
        setSuccessMessage(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access microphone. Please check permissions.');
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks in the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleGenerateSummary = async () => {
    if (!audioFile) return;

    setIsGenerating(true);
    setError(null);
    setSummary('');
    setTranscription('');
    setIsRateLimited(false);
    
    try {
      // Check file size and warn if it's too large
      const fileSizeMB = audioFile.size / (1024 * 1024);
      if (fileSizeMB > 25) {
        setError(`This file is ${fileSizeMB.toFixed(1)} MB which is quite large. OpenAI's API may have trouble processing it. Consider using a smaller file (under 10MB) for better reliability.`);
        // Continue anyway, but with a warning
      }
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('title', audioFile.name || 'Audio Recording');
      
      // Call the audio-summarize API with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
      
      try {
        // Show a more detailed progress message
        setError("Processing audio...");
        
        const response = await fetch('/api/audio-summarize', {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Clear the processing message
        setError(null);
        
        // Check if the response is JSON before trying to parse it
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // If not JSON, get the text content for better error reporting
          const textContent = await response.text();
          console.error('Non-JSON response:', textContent.substring(0, 500));
          throw new Error('Server returned an invalid response format. This could be due to network issues or server errors. Please try again later.');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
          // Check for rate limit error
          if (response.status === 429 && data.rate_limited) {
            setIsRateLimited(true);
            setRetryCountdown(60); // Set a 60-second countdown
            throw new Error(data.error || 'Rate limit exceeded. Please wait before trying again.');
          }
          
          // If we have a transcription but no summary, display the transcription
          if (data.transcription) {
            setTranscription(data.transcription);
            throw new Error(data.error || 'Failed to generate summary, but transcription was successful.');
          } else {
            throw new Error(data.error || 'Failed to process audio');
          }
        }
        
        setTranscription(data.transcription || '');
        setSummary(data.summary || '');
        
        if (!data.summary && data.transcription) {
          throw new Error('Transcription successful, but no summary was generated.');
        }
        
        // Set success message and clear it after 3 seconds
        setSuccessMessage('Audio processed successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        // Handle fetch errors
        const fetchError = error as Error;
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. The audio file might be too large or the server is busy. Please try again later or use a shorter audio file.');
        }
        
        if (fetchError.message.includes('API key')) {
          throw new Error('OpenAI API key error. Please check your API key configuration.');
        }
        
        if (fetchError.message.includes('network') || fetchError.message.includes('ECONNRESET')) {
          throw new Error(
            'Network connection error when contacting OpenAI. This is a common issue with their API. Please try: ' +
            '1) Using a smaller audio file (under 10MB), ' +
            '2) Trying again in a few minutes, or ' +
            '3) Converting your audio to a different format (MP3 or WAV).'
          );
        }
        
        if (fetchError.message.includes('rate limit') || fetchError.message.includes('429')) {
          setIsRateLimited(true);
          setRetryCountdown(60); // Set a 60-second countdown
          throw new Error(
            'OpenAI API rate limit exceeded. This means you\'ve made too many requests in a short period. Please: ' +
            '1) Wait 1-2 minutes before trying again, ' +
            '2) Check if you\'re using a free tier API key with limited quota, or ' +
            '3) Consider upgrading your OpenAI API plan for higher limits.'
          );
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  }

  const handleSaveSummary = async () => {
    if (!summary || !transcription) {
      setError('No summary to save. Please generate a summary first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/sign-in');
        return;
      }

      const { error } = await supabase.from('audio_summaries').insert({
        user_id: session.user.id,
        title: audioFile?.name || 'Audio Recording',
        transcription,
        summary,
      });

      if (error) throw error;
      
      setSuccessMessage('Summary saved successfully!');
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving summary:', error);
      setError(error instanceof Error ? error.message : 'Failed to save summary. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <h1 className="text-xl font-bold dark:text-white">Summarizer</h1>
        </div>
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="text-gray-600 dark:text-gray-300 focus:outline-none"
        >
          {showMobileMenu ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)}></div>
      )}

      {/* Sidebar - Hidden on mobile unless menu is open */}
      <div 
        ref={mobileMenuRef}
        className={`${showMobileMenu ? 'fixed inset-y-0 left-0 z-50 w-64' : 'hidden'} md:block md:relative md:w-64 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out`}
      >
        <div className="p-6 hidden md:block">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold dark:text-white">Summarizer</h1>
          </div>
        </div>
        <nav className="mt-6">
          <div className="px-4">
            <Link href="/dashboard">
              <motion.div 
                whileHover={{ x: 5 }}
                className="group flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
              >
                <HomeIcon />
                <span className="mx-4 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Home</span>
              </motion.div>
            </Link>
          </div>
          <div className="px-4 mt-4">
            <Link href="/new-summary">
              <motion.div 
                whileHover={{ x: 5 }}
                className="group flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
              >
                <NewIcon />
                <span className="mx-4 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">New Summary</span>
              </motion.div>
            </Link>
          </div>
          <div className="px-4 mt-4">
            <Link href="/audio-summarization">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center px-4 py-3 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded-md"
              >
                <AudioIcon />
                <span className="mx-4 font-medium">Audio Summarization</span>
              </motion.div>
            </Link>
          </div>
          <div className="px-4 mt-4">
            <Link href="/history">
              <motion.div 
                whileHover={{ x: 5 }}
                className="group flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
              >
                <HistoryIcon />
                <span className="mx-4 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">History</span>
              </motion.div>
            </Link>
          </div>
          <div className="px-4 mt-4">
            <Link href="/settings">
              <motion.div 
                whileHover={{ x: 5 }}
                className="group flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
              >
                <SettingsIcon />
                <span className="mx-4 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Settings</span>
              </motion.div>
            </Link>
          </div>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="group flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors w-full"
          >
            <LogoutIcon />
            <span className="mx-4 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Logout</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-4 md:mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"
            >
              Audio Summarization
            </motion.h1>
          </div>

          {/* Tab Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm mb-4 md:mb-8 inline-flex"
          >
            <button
              className="py-2 px-4 md:px-6 rounded-full text-gray-600 dark:text-gray-300 font-medium text-sm md:text-base"
              onClick={() => router.push('/new-summary')}
            >
              Text
            </button>
            <button
              className="py-2 px-4 md:px-6 rounded-full bg-black dark:bg-indigo-600 text-white font-medium text-sm md:text-base"
            >
              Audio
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 h-full transition-colors duration-200">
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-white">Audio Input</h2>
                
                <div className="mb-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 md:p-6 text-center">
                    {audioFile ? (
                      <div className="w-full">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                            <AudioIcon />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{audioFile.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        
                        {audioUrl && (
                          <div className="mb-4">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <button
                                onClick={togglePlayPause}
                                className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/50"
                              >
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                              </button>
                              <button
                                onClick={() => {
                                  if (audioRef.current) {
                                    audioRef.current.pause();
                                    audioRef.current.currentTime = 0;
                                    setIsPlaying(false);
                                  }
                                }}
                                className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/50"
                              >
                                <StopIcon />
                              </button>
                            </div>
                            <audio ref={audioRef} src={audioUrl} className="hidden" />
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setAudioFile(null);
                              setAudioUrl('');
                              if (audioRef.current) {
                                audioRef.current.pause();
                                setIsPlaying(false);
                              }
                            }}
                            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Remove
                          </button>
                          <button
                            onClick={handleGenerateSummary}
                            disabled={isGenerating}
                            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            {isGenerating ? 'Processing...' : 'Generate Summary'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-4">
                            <UploadIcon />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Upload Audio File</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">MP3, WAV, or M4A up to 25MB</p>
                          
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                            <label className="flex-1">
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                              <div className="py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer text-center">
                                Select File
                              </div>
                            </label>
                            
                            <button
                              onClick={startRecording}
                              disabled={isRecording}
                              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              {isRecording ? `Recording (${recordingTime}s)` : 'Record Audio'}
                            </button>
                          </div>
                          
                          {isRecording && (
                            <button
                              onClick={stopRecording}
                              className="mt-2 py-2 px-4 border border-red-300 dark:border-red-700 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Stop Recording
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 h-full transition-colors duration-200">
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-white">Generated Summary</h2>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md text-sm">
                    <p className="font-medium mb-1">Error:</p>
                    <p>{error}</p>
                    {isRateLimited ? (
                      <div className="mt-2">
                        <p className="text-xs mb-1">OpenAI's API has rate limits to prevent overuse. Please wait before trying again.</p>
                        <button 
                          onClick={handleGenerateSummary}
                          disabled={retryCountdown > 0}
                          className={`mt-1 px-3 py-1 ${retryCountdown > 0 ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200'} rounded-md text-xs font-medium transition-colors`}
                        >
                          {retryCountdown > 0 ? `Try Again (${retryCountdown}s)` : 'Try Again Now'}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={handleGenerateSummary}
                        className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 rounded-md text-xs font-medium transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}
                
                {transcription && (
                  <div className="mb-4">
                    <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Transcription</h3>
                    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm max-h-40 overflow-y-auto">
                      {transcription}
                    </div>
                  </div>
                )}
                
                {summary ? (
                  <div className="mb-4">
                    <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Summary</h3>
                    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm">
                      {summary}
                    </div>
                    
                    <button
                      onClick={handleSaveSummary}
                      disabled={loading}
                      className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Summary'}
                    </button>
                  </div>
                ) : !error && !isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-center">Upload or record audio and click "Generate Summary" to see the result here.</p>
                  </div>
                ) : isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Processing audio...</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This may take a minute or two depending on the file size.</p>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 