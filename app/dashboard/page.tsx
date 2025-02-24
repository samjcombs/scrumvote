import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/DashboardHeader'
import { CreateRoomButton } from '@/components/CreateRoomButton'
import { JoinRoomForm } from '@/components/JoinRoomForm'
import { getUserRooms, getParticipatingRooms } from '@/lib/data-service'

export default async function Dashboard() {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    redirect('/auth/signin')
  }
  
  const userId = session.user.id
  const ownedRooms = getUserRooms(userId)
  const participatingRooms = getParticipatingRooms(userId)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-500 dark:to-dark-400">
      <DashboardHeader user={session.user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <CreateRoomButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Your Rooms</h2>
            
            {ownedRooms.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">You haven't created any rooms yet.</p>
            ) : (
              <ul className="space-y-3">
                {ownedRooms.map(room => (
                  <li key={room.id} className="p-3 glass dark:glass-dark rounded-lg">
                    <Link href={`/room/${room.id}`} className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        {room.description && <p className="text-sm opacity-70">{room.description}</p>}
                      </div>
                      <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-700/20 text-primary-700 dark:text-primary-100 rounded-full">
                        {room.active ? 'Active' : 'Closed'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Joined Rooms</h2>
            
            {participatingRooms.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">You haven't joined any rooms yet.</p>
            ) : (
              <ul className="space-y-3">
                {participatingRooms.map(room => (
                  <li key={room.id} className="p-3 glass dark:glass-dark rounded-lg">
                    <Link href={`/room/${room.id}`} className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        {room.description && <p className="text-sm opacity-70">{room.description}</p>}
                      </div>
                      <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-700/20 text-primary-700 dark:text-primary-100 rounded-full">
                        {room.active ? 'Active' : 'Closed'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold mb-4">Join a Room</h2>
          <JoinRoomForm />
        </div>
      </main>
    </div>
  )
} 