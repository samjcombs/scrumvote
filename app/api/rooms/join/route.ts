import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getRoom, addParticipant } from '@/lib/data-service'

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { roomId } = await request.json()
    
    const room = getRoom(roomId)
    
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    
    // Add user as participant
    addParticipant(
      session.user.id, 
      roomId, 
      session.user.name || 'Anonymous', 
      session.user.image || null
    )
    
    return NextResponse.json(room)
  } catch (error) {
    console.error('Error joining room:', error)
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 })
  }
} 