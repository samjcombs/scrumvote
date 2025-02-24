'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

interface DashboardHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <header className="sticky top-0 z-10 glass dark:glass-dark backdrop-blur-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">Scrum Poker</Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2"
            >
              {user.image ? (
                <Image 
                  src={user.image} 
                  alt={user.name || 'User'} 
                  width={32} 
                  height={32} 
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                  {user.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="hidden md:inline">{user.name}</span>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 glass dark:glass-dark rounded-md shadow-lg py-1">
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 hover:bg-dark-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left px-4 py-2 hover:bg-dark-100 transition-colors text-red-500"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 