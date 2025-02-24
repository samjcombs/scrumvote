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
  
  try {
    const room = getRoom(params.id)
    
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    
    if (room.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Only room owner can reveal votes' }, { status: 403 })
    }
    
    // Reveal votes
    const updatedRoom = revealVotes(params.id)
    
    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error('Error revealing votes:', error)
    return NextResponse.json({ error: 'Failed to reveal votes' }, { status: 500 })
  }
} 