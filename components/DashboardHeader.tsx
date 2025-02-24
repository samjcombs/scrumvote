'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { ThemeToggle } from './ThemeToggle'
import Image from 'next/image'

export function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="bg-white dark:bg-dark-600 shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          Scrum Poker
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            {user.image && (
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image 
                  src={user.image} 
                  alt={user.name || 'User'} 
                  width={32} 
                  height={32}
                />
              </div>
            )}
            <span>{user.name}</span>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
} 