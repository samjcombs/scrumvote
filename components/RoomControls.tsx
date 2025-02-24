'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Room {
  id: string
  name: string
  active: boolean
  currentTask: string | null
  revealed: boolean
}

interface RoomControlsProps {
  room: Room
}

export function RoomControls({ room }: RoomControlsProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskName, setTaskName] = useState(room.currentTask || '')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const handleRevealVotes = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/${room.id}/reveal`, {
        method: 'POST',
      })
      
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error revealing votes:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleResetVotes = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/${room.id}/reset`, {
        method: 'POST',
      })
      
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error resetting votes:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSetTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/${room.id}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: taskName,
        }),
      })
      
      if (response.ok) {
        setIsTaskModalOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error('Error setting task:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="btn-primary"
          disabled={isLoading}
        >
          Set Task
        </button>
        
        {!room.revealed ? (
          <button
            onClick={handleRevealVotes}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            disabled={isLoading}
          >
            Reveal Votes
          </button>
        ) : (
          <button
            onClick={handleResetVotes}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            disabled={isLoading}
          >
            New Round
          </button>
        )}
      </div>
      
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Set Current Task</h2>
            
            <form onSubmit={handleSetTask}>
              <div className="mb-6">
                <label htmlFor="taskName" className="block mb-1 font-medium">
                  Task Description
                </label>
                <textarea
                  id="taskName"
                  value={taskName}
                  onChange={e => setTaskName(e.target.value)}
                  className="w-full p-2 rounded-md bg-white dark:bg-dark-300 border border-gray-300 dark:border-gray-700"
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
} 