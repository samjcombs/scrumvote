'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function RoomControls({ 
  roomId,
  revealed,
  currentTask
}: { 
  roomId: string
  revealed: boolean
  currentTask: string | null
}) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [task, setTask] = useState(currentTask || '')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleReveal = async () => {
    if (isLoading) return
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/${roomId}/reveal`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to reveal votes')
      }
      
      router.refresh()
    } catch (error) {
      console.error('Error revealing votes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    if (isLoading) return
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/${roomId}/reset`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to reset votes')
      }
      
      router.refresh()
    } catch (error) {
      console.error('Error resetting votes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/${roomId}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to set task')
      }
      
      setIsTaskModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error setting task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Room Controls</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="w-full btn-primary"
          disabled={isLoading}
        >
          Set Task
        </button>
        
        {revealed ? (
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 rounded-md transition-colors"
            disabled={isLoading}
          >
            Reset Votes
          </button>
        ) : (
          <button
            onClick={handleReveal}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 rounded-md transition-colors"
            disabled={isLoading}
          >
            Reveal Votes
          </button>
        )}
      </div>
      
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-600 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Set Task</h2>
            
            <form onSubmit={handleSetTask}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Task Description
                </label>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-400 rounded-md bg-white dark:bg-dark-700"
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-500 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 