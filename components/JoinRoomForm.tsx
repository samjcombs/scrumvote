'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function JoinRoomForm() {
  const [roomId, setRoomId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to join room')
      }
      
      const data = await response.json()
      router.push(`/room/${data.id}`)
    } catch (error) {
      console.error('Error joining room:', error)
      setError(error instanceof Error ? error.message : 'Failed to join room')
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500">
          {error}
        </div>
      )}
      
      <div className="flex gap-4">
        <input 
          type="text" 
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          placeholder="Enter room ID" 
          className="flex-1 p-2 rounded-md bg-white dark:bg-dark-300 border border-gray-300 dark:border-gray-700"
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