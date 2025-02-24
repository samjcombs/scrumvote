'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreateRoomButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [roomDescription, setRoomDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roomName,
          description: roomDescription,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create room')
      }
      
      const data = await response.json()
      router.push(`/room/${data.id}`)
    } catch (error) {
      console.error('Error creating room:', error)
      setIsLoading(false)
    }
  }
  
  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn-primary"
      >
        Create Room
      </button>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Create a New Room</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="roomName" className="block mb-1 font-medium">
                  Room Name
                </label>
                <input
                  id="roomName"
                  type="text"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  className="w-full p-2 rounded-md bg-white dark:bg-dark-300 border border-gray-300 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="roomDescription" className="block mb-1 font-medium">
                  Description (optional)
                </label>
                <textarea
                  id="roomDescription"
                  value={roomDescription}
                  onChange={e => setRoomDescription(e.target.value)}
                  className="w-full p-2 rounded-md bg-white dark:bg-dark-300 border border-gray-300 dark:border-gray-700"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
} 