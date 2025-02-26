'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

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

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
)

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const AddDocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

// Add a menu icon for mobile navigation
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

// Add a close icon for mobile navigation
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

type SummaryCard = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { darkMode } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const [summaries, setSummaries] = useState<SummaryCard[]>([
    {
      id: '1',
      title: 'The Future of Artificial Intelligence in Healthcare',
      description: 'This comprehensive study explores the potential impact of AI technologies in',
      date: 'Feb 15, 2024',
      category: 'Research'
    },
    {
      id: '2',
      title: 'Global Economic Trends 2024',
      description: 'An in-depth analysis of emerging economic patterns and their implications for global',
      date: 'Feb 14, 2024',
      category: 'Analysis'
    },
    {
      id: '3',
      title: 'Sustainable Energy Solutions',
      description: 'Examining the latest developments in renewable energy technologies and their',
      date: 'Feb 14, 2024',
      category: 'Report'
    },
    {
      id: '4',
      title: 'Digital Transformation Strategies',
      description: 'A comprehensive guide to implementing digital transformation in modern',
      date: 'Feb 13, 2024',
      category: 'Business'
    },
    {
      id: '5',
      title: 'Climate Change Impact Assessment',
      description: 'Analysis of recent climate data and its implications for global environmental',
      date: 'Feb 13, 2024',
      category: 'Research'
    }
  ])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/sign-in')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }
    checkUser()
  }, [router, supabase])

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
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

  const formatDate = () => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Research':
        return 'text-purple-600';
      case 'Analysis':
        return 'text-blue-600';
      case 'Report':
        return 'text-green-600';
      case 'Business':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
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
                className="flex items-center px-4 py-3 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md"
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
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
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
                className="group flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
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
                className="group flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
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
                className="group flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
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
            className="group flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors w-full"
          >
            <LogoutIcon />
            <span className="mx-4 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Logout</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"
              >
                Welcome back, {user?.user_metadata?.name || 'Alex'}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-600 dark:text-gray-400"
              >
                {formatDate()}
              </motion.p>
            </div>
            <div className="flex items-center space-x-3 relative mt-4 md:mt-0" ref={userMenuRef}>
              <div className="text-right">
                <p className="text-gray-800 dark:text-white font-medium">{user?.user_metadata?.name || 'Alex Thompson'}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">User</p>
              </div>
              <div 
                className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {(user?.user_metadata?.name || 'A')[0]}
              </div>
              
              {/* User dropdown menu */}
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10"
                >
                  <Link href="/settings">
                    <div className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      Settings
                    </div>
                  </Link>
                  <div 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
            {/* New Summary Card */}
            <Link href="/new-summary">
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 cursor-pointer h-64 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg w-fit">
                    <NewIcon />
                  </div>
                  <h2 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">New Summary</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Create a new text summary from articles, documents, or web content.</p>
                </div>
                <div className="flex justify-end">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Audio Summarization Card */}
            <Link href="/audio-summarization">
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 cursor-pointer h-64 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg w-fit">
                    <AudioIcon />
                  </div>
                  <h2 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">Audio Summarization</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Convert audio recordings or files into concise text summaries.</p>
                </div>
                <div className="flex justify-end">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Recent Activity Card */}
            <Link href="/history">
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 cursor-pointer h-64 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg w-fit">
                    <HistoryIcon />
                  </div>
                  <h2 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">Recent Activity</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">View your recent summaries and activity history.</p>
                </div>
                <div className="flex justify-end">
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 