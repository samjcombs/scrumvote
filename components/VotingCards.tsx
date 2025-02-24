'use client'

import { useState, useEffect } from 'react'

const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '?']

export function VotingCards({ 
  roomId, 
  userId,
  revealed,
  disabled = false
}: { 
  roomId: string
  userId: string
  revealed: boolean
  disabled?: boolean
}) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch current vote when component mounts
  useEffect(() => {
    const fetchVote = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/votes?userId=${userId}`)
        const data = await response.json()
        setSelectedValue(data.vote)
      } catch (error) {
        console.error('Error fetching vote:', error)
      }
    }
    
    fetchVote()
  }, [roomId, userId])

  const handleVote = async (value: string) => {
    if (disabled || isLoading) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/${roomId}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          vote: value,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit vote')
      }
      
      setSelectedValue(value)
    } catch (error) {
      console.error('Error submitting vote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {CARD_VALUES.map(value => (
        <button
          key={value}
          onClick={() => handleVote(value)}
          disabled={disabled || isLoading}
          className={`
            aspect-[2/3] flex items-center justify-center rounded-lg text-xl font-bold
            ${selectedValue === value 
              ? 'bg-primary-500 text-white' 
              : 'bg-white dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            transition-colors
          `}
        >
          {value}
        </button>
      ))}
    </div>
  )
} 