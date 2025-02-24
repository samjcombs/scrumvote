'use client'

import Image from 'next/image'

interface Participant {
  id: string
  userId: string
  vote: string | null
  user: {
    name: string | null
    image: string | null
  }
}

interface ParticipantsListProps {
  participants: Participant[]
  revealed: boolean
}

export function ParticipantsList({ participants, revealed }: ParticipantsListProps) {
  return (
    <ul className="space-y-3">
      {participants.map(participant => (
        <li key={participant.id} className="flex items-center gap-3 p-2 glass dark:glass-dark rounded-lg">
          {participant.user.image ? (
            <Image 
              src={participant.user.image} 
              alt={participant.user.name || 'User'} 
              width={32} 
              height={32} 
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
              {participant.user.name?.charAt(0) || 'U'}
            </div>
          )}
          
          <span className="flex-1 truncate">{participant.user.name}</span>
          
          {participant.vote ? (
            <span className={`
              w-8 h-8 flex items-center justify-center rounded-full 
              ${revealed 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 dark:bg-dark-300'}
            `}>
              {revealed ? participant.vote : '✓'}
            </span>
          ) : (
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-dark-300 text-gray-500">
              ?
            </span>
          )}
        </li>
      ))}
    </ul>
  )
} 