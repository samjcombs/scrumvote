'use client'

import Image from 'next/image'

type Participant = {
  id: string
  userId: string
  vote: string | null
  user: {
    name: string | null
    image: string | null
  }
}

export function ParticipantsList({ 
  participants,
  revealed
}: { 
  participants: Participant[]
  revealed: boolean
}) {
  return (
    <ul className="space-y-3">
      {participants.map(participant => (
        <li key={participant.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300">
              {participant.user.name?.[0] || '?'}
            </div>
            <span>{participant.user.name || 'Anonymous'}</span>
          </div>
          
          <div className="w-8 h-8 flex items-center justify-center">
            {participant.vote ? (
              revealed ? (
                <span className="font-bold">{participant.vote}</span>
              ) : (
                <span className="text-green-500">✓</span>
              )
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
} 