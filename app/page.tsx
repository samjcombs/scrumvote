import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function Home() {
  const session = await getServerSession()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="card max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Scrum Poker</h1>
        <p className="text-lg mb-8 opacity-80">
          A modern planning poker app for agile teams with real-time voting and GitHub authentication.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signin" className="btn-primary">
            Sign in with GitHub
          </Link>
          <Link href="/about" className="px-4 py-2 border border-gray-500 rounded-md hover:bg-dark-100 transition-colors">
            Learn More
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Real-time Voting</h2>
          <p className="opacity-70">See votes as they happen with our real-time interface powered by Socket.io.</p>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">GitHub Integration</h2>
          <p className="opacity-70">Sign in with your GitHub account for a seamless experience.</p>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Custom Rooms</h2>
          <p className="opacity-70">Create and join custom rooms for your team's planning sessions.</p>
        </div>
      </div>
    </main>
  )
} 