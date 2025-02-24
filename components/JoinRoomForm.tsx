'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function JoinRoomForm() {
  const [roomId, setRoomId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to join room')
      }
      
      router.push(`/room/${roomId}`)
    } catch (error: any) {
      console.error('Error joining room:', error)
      setError(error.message)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}
      <div className="flex gap-2">
        <input 
          type="text" 
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID" 
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-400 rounded-md bg-white dark:bg-dark-700"
          required
        />
        <button 
          type="submit" 
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Joining...' : 'Join'}
        </button>
      </div>
    </form>
  )
} 