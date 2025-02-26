'use client'

import { useState, useEffect, useRef } from 'react'
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

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const AudioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
)

const AIEnhancementsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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

export default function NewSummaryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [article, setArticle] = useState('')
  const [title, setTitle] = useState('')
  const [summaryPercentage, setSummaryPercentage] = useState(50)
  const [summaryType, setSummaryType] = useState<'extractive' | 'abstractive'>('extractive')
  const [summary, setSummary] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [retryCountdown, setRetryCountdown] = useState(0)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/sign-in')
  }

  const handleGenerateSummary = async () => {
    if (!article || !title) return

    setIsGenerating(true)
    setSummary('')
    setError(null)
    setIsRateLimited(false)
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article,
          title,
          summaryPercentage,
          summaryType
        }),
      });

      // Check if the response is JSON before trying to parse it
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, get the text content for better error reporting
        const textContent = await response.text();
        console.error('Non-JSON response:', textContent.substring(0, 500));
        throw new Error('Server returned an invalid response format. This is likely due to missing API keys. Please check your .env.local file and ensure the OPENAI_API_KEY is set correctly.');
      }

      const data = await response.json();
      
      if (!response.ok) {
        // Check for rate limit error
        if (response.status === 429 && data.rate_limited) {
          setIsRateLimited(true);
          setRetryCountdown(60); // Set a 60-second countdown
          throw new Error(data.error || 'Rate limit exceeded. Please wait before trying again.');
        }
        
        throw new Error(data.error || 'Failed to generate summary');
      }
      
      setSummary(data.summary);
      setSuccessMessage('Summary generated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate summary. Please try again.');
      
      // Check for rate limit errors in the error message
      if (error instanceof Error && (error.message.includes('rate limit') || error.message.includes('429'))) {
        setIsRateLimited(true);
        setRetryCountdown(60); // Set a 60-second countdown
      }
      
      // Add helpful message about API keys if there's an error
      if (error instanceof Error && error.message.includes('API key')) {
        setError(error.message + "\n\nTo fix this issue, you need to add your OpenAI API key to the .env.local file in the root directory of the project.");
      }
    } finally {
      setIsGenerating(false);
    }
  }

  const handleSaveSummary = async () => {
    if (!summary) return

    setLoading(true)
    setError(null)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/sign-in')
        return
      }

      const { error } = await supabase.from('articles').insert({
        user_id: session.user.id,
        title,
        content: article,
        summary,
        summary_percentage: summaryPercentage,
        summary_type: summaryType,
      })

      if (error) throw error
      
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
                className="flex items-center px-4 py-3 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded-md"
              >
                <NewIcon />
                <span className="mx-4 font-medium">New Summary</span>
              </motion.div>
            </Link>
          </div>
          <div className="px-4 mt-4">
            <Link href="/audio-summarization">
              <motion.div 
                whileHover={{ x: 5 }}
                className="group flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
              >
                <AudioIcon />
                <span className="mx-4 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Audio Summarization</span>
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
              New Summary
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
              className="py-2 px-4 md:px-6 rounded-full bg-black dark:bg-indigo-600 text-white font-medium text-sm md:text-base"
            >
              Text
            </button>
            <button
              className="py-2 px-4 md:px-6 rounded-full text-gray-600 dark:text-gray-300 font-medium text-sm md:text-base"
              onClick={() => router.push('/audio-summarization')}
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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 h-full">
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-white">Article Input</h2>
                
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter article title"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="article" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Article Content
                  </label>
                  <textarea
                    id="article"
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-40 md:h-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Paste your article here..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Summary Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-indigo-600 dark:bg-gray-800 dark:border-gray-600"
                        name="summaryType"
                        checked={summaryType === 'extractive'}
                        onChange={() => setSummaryType('extractive')}
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">Extractive</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-indigo-600 dark:bg-gray-800 dark:border-gray-600"
                        name="summaryType"
                        checked={summaryType === 'abstractive'}
                        onChange={() => setSummaryType('abstractive')}
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">Abstractive</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Powered by ChatGPT</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Summary Length: {summaryPercentage}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={summaryPercentage}
                    onChange={(e) => setSummaryPercentage(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateSummary}
                  disabled={!article || !title || isGenerating}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate Summary'}
                </motion.button>
              </div>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 h-full">
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
                
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-md text-sm">
                    {successMessage}
                  </div>
                )}
                
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-10 h-10 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Generating summary...</p>
                  </div>
                ) : summary ? (
                  <div className="mb-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                      <div className="whitespace-pre-wrap">{summary}</div>
                    </div>
                    <button
                      onClick={handleSaveSummary}
                      disabled={loading}
                      className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Summary'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-center">Enter your article and click "Generate Summary" to see the result here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 