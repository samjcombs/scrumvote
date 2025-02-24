import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  // Redirect to dashboard or auth page
  redirect('/dashboard')
} 