'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type ThemeContextType = {
  darkMode: boolean
  toggleDarkMode: () => void
}

// Create context with default values to avoid the "must be used within a ThemeProvider" error
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize dark mode from localStorage on component mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Use saved preference, or system preference as fallback
    setDarkMode(savedTheme === 'true' || (savedTheme === null && prefersDark))
  }, [])

  // Update HTML class and localStorage when darkMode changes
  useEffect(() => {
    if (!mounted) return
    
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode, mounted])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
} 