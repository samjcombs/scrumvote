import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { getRoom } from '@/lib/data-service'
import { VotingCards } from '@/components/VotingCards'
import { ParticipantsList } from '@/components/ParticipantsList'
import { RoomControls } from '@/components/RoomControls'
import { addParticipant } from '@/lib/data-service'

export default async function RoomPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    redirect('/auth/signin')
  }
  
  const userId = (session.user as any).id
  const room = getRoom(params.id)
  
  if (!room) {
    redirect('/dashboard')
  }
  
  // Check if user is a participant, if not add them
  const isParticipant = room.participants.some((p: any) => p.userId === userId)
  
  if (!isParticipant) {
    // Add user as participant
    // This would typically be done via an API call, but for simplicity:
    const name = session.user.name || 'Anonymous'
    const image = session.user.image || null
    // You might need to implement this function
    addParticipant(userId, params.id, name, image)
  }
  
  const isOwner = room.ownerId === userId
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-500 dark:to-dark-400">
      <header className="bg-white dark:bg-dark-600 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Room: {room.name}</h1>
            <div className="flex items-center gap-4">
              <span>{session.user.name}</span>
            </div>
          </div>
          {room.currentTask && (
            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-md">
              <h2 className="font-medium mb-1">Current Task:</h2>
              <p>{room.currentTask}</p>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Vote</h2>
              <VotingCards 
                roomId={params.id} 
                userId={userId} 
                revealed={room.revealed}
                disabled={room.revealed}
              />
            </div>
            
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Participants</h2>
                {room.revealed && (
                  <div className="text-sm px-2 py-1 bg-primary-100 dark:bg-primary-700/20 text-primary-700 dark:text-primary-100 rounded-full">
                    Votes Revealed
                  </div>
                )}
              </div>
              <ParticipantsList 
                participants={room.participants} 
                revealed={room.revealed}
              />
            </div>
          </div>
          
          {isOwner && (
            <div className="lg:col-span-1">
              <RoomControls 
                roomId={params.id}
                revealed={room.revealed}
                currentTask={room.currentTask}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Helper function to add participant
async function addParticipantToRoom(roomId: string, userId: string, name: string, image: string | null) {
  try {
    await fetch('/api/rooms/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId }),
    })
  } catch (error) {
    console.error('Error adding participant:', error)
  }
} 