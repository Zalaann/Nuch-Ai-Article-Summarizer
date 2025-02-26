'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const NewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

const AudioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
)

type SummaryDetail = {
  id: string;
  title: string;
  content: string;
  summary: string;
  summary_type: 'extractive' | 'abstractive';
  summary_percentage: number;
  created_at: string;
}

export default function SummaryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummaryDetail = async () => {
      setLoading(true)
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/auth/sign-in')
          return
        }

        // Fetch the specific summary from the database
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (error) throw error
        
        if (data) {
          setSummary(data as SummaryDetail)
        } else {
          setError('Summary not found')
        }
      } catch (error) {
        console.error('Error fetching summary:', error)
        setError('Failed to load summary details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSummaryDetail()
    }
  }, [params.id, router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/sign-in')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
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
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
              >
                <HomeIcon />
                <span className="mx-4 font-medium">Home</span>
              </motion.div>
            </Link>
          </div>
          <div className="px-4 mt-4">
            <Link href="/new-summary">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
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
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
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
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
              >
                <HistoryIcon />
                <span className="mx-4 font-medium">History</span>
              </motion.div>
            </Link>
          </div>
          <div className="px-4 mt-4">
            <Link href="/settings">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
              >
                <SettingsIcon />
                <span className="mx-4 font-medium">Settings</span>
              </motion.div>
            </Link>
          </div>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors w-full"
          >
            <LogoutIcon />
            <span className="mx-4 font-medium">Logout</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center mb-8">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => router.push('/history')}
              className="mr-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <BackIcon />
            </motion.button>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              Summary Details
            </motion.h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{error}</h3>
                <Link href="/history">
                  <button className="mt-6 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Back to History
                  </button>
                </Link>
              </div>
            </div>
          ) : summary ? (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90"
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{summary.title}</h2>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                    Created: {formatDate(summary.created_at)}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    summary.summary_type === 'extractive' 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' 
                      : 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300'
                  }`}>
                    {summary.summary_type.charAt(0).toUpperCase() + summary.summary_type.slice(1)}
                  </span>
                  <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                    {summary.summary_percentage}% length
                  </span>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Summary</h3>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                    <p className="whitespace-pre-wrap">{summary.summary}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Original Content</h3>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 max-h-96 overflow-y-auto">
                    <p className="whitespace-pre-wrap">{summary.content}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
} 