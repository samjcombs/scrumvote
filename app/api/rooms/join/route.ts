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
    
    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }
    
    const room = getRoom(roomId)
    
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    
    const userId = (session.user as any).id
    const name = session.user.name || 'Anonymous'
    const image = session.user.image || null
    
    const updatedRoom = addParticipant(roomId, userId, name, image)
    return NextResponse.json(updatedRoom)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 