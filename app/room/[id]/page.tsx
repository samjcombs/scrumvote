import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/DashboardHeader'
import { VotingCards } from '@/components/VotingCards'
import { ParticipantsList } from '@/components/ParticipantsList'
import { RoomControls } from '@/components/RoomControls'
import { getRoom, addParticipant } from '@/lib/data-service'

export default async function RoomPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    redirect('/auth/signin')
  }
  
  const userId = session.user.id
  const room = getRoom(params.id)
  
  if (!room) {
    redirect('/dashboard')
  }
  
  // Check if user is already a participant
  const isParticipant = room.participants.some(p => p.userId === userId)
  const isOwner = room.ownerId === userId
  
  // If not a participant, add them
  if (!isParticipant) {
    addParticipant(
      userId, 
      room.id, 
      session.user.name || 'Anonymous', 
      session.user.image || null
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-500 dark:to-dark-400">
      <DashboardHeader user={session.user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="w-full md:w-3/4">
            <div className="card mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{room.name}</h1>
                {isOwner && <RoomControls room={room} />}
              </div>
              
              {room.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-4">{room.description}</p>
              )}
              
              <div className="p-4 glass dark:glass-dark rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  {room.currentTask || 'No active task'}
                </h2>
                <p className="text-sm opacity-70">
                  {room.revealed 
                    ? 'Votes are revealed' 
                    : 'Voting in progress - votes are hidden'}
                </p>
              </div>
            </div>
            
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Your Vote</h2>
              <VotingCards 
                roomId={room.id} 
                userId={userId}
                revealed={room.revealed}
                disabled={!room.active}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Participants</h2>
              <ParticipantsList 
                participants={room.participants} 
                revealed={room.revealed}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 