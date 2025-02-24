import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getRoom, revealVotes } from '@/lib/data-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const roomId = params.id
  
  try {
    const room = getRoom(roomId)
    
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    
    const userId = (session.user as any).id
    
    if (room.ownerId !== userId) {
      return NextResponse.json({ error: 'Only room owner can reveal votes' }, { status: 403 })
    }
    
    // Reveal votes
    const updatedRoom = revealVotes(roomId)
    
    return NextResponse.json(updatedRoom)
  } catch (error: any) {
    console.error('Error revealing votes:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 