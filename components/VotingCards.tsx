'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?']

interface VotingCardsProps {
  roomId: string
  userId: string
  revealed: boolean
  disabled: boolean
}

export function VotingCards({ roomId, userId, revealed, disabled }: VotingCardsProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    // Fetch current vote if exists
    const fetchCurrentVote = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/votes?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.vote) {
            setSelectedCard(data.vote)
          }
        }
      } catch (error) {
        console.error('Error fetching current vote:', error)
      }
    }
    
    fetchCurrentVote()
  }, [roomId, userId])
  
  const handleVote = async (value: string) => {
    if (disabled) return
    
    setIsSubmitting(true)
    
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
      
      if (response.ok) {
        setSelectedCard(value)
        router.refresh()
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {CARD_VALUES.map(value => (
        <button
          key={value}
          onClick={() => handleVote(value)}
          disabled={isSubmitting || disabled}
          className={`
            aspect-[2/3] flex items-center justify-center rounded-lg text-2xl font-bold
            transition-all transform hover:scale-105
            ${selectedCard === value 
              ? 'bg-primary-500 text-white shadow-lg scale-105' 
              : 'glass dark:glass-dark hover:shadow-md'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {value}
        </button>
      ))}
    </div>
  )
} 