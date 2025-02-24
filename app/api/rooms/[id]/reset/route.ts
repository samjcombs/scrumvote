import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getRoom, resetVotes } from '@/lib/data-service'

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
      return NextResponse.json({ error: 'Only room owner can reset votes' }, { status: 403 })
    }
    
    // Reset votes
    const updatedRoom = resetVotes(params.id)
    
    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error('Error resetting votes:', error)
    return NextResponse.json({ error: 'Failed to reset votes' }, { status: 500 })
  }
} 