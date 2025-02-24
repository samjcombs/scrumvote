import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserRooms, getParticipatingRooms } from '@/lib/data-service'

export default async function Dashboard() {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    redirect('/auth/signin')
  }
  
  const userId = (session.user as any).id
  const ownedRooms = getUserRooms(userId)
  const participatingRooms = getParticipatingRooms(userId)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-500 dark:to-dark-400">
      <header className="bg-white dark:bg-dark-600 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Scrum Poker</h1>
          <div className="flex items-center gap-4">
            <span>{session.user.name}</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/create-room" className="btn-primary">
            Create Room
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Your Rooms</h2>
            
            {ownedRooms.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">You haven't created any rooms yet.</p>
            ) : (
              <ul className="space-y-3">
                {ownedRooms.map((room: any) => (
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
                {participatingRooms.map((room: any) => (
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
          <form className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter room ID" 
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-400 rounded-md bg-white dark:bg-dark-700"
            />
            <button type="submit" className="btn-primary">
              Join
            </button>
          </form>
        </div>
      </main>
    </div>
  )
} 