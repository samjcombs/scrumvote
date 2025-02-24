import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getRoom, submitVote } from '@/lib/data-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const roomId = params.id
  const userId = (session.user as any).id
  
  try {
    const room = getRoom(roomId)
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    
    const participant = room.participants.find((p: any) => p.userId === userId)
    return NextResponse.json({ vote: participant?.vote || null })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { vote } = await request.json()
    
    if (!vote) {
      return NextResponse.json({ error: 'Vote is required' }, { status: 400 })
    }
    
    const roomId = params.id
    const userId = (session.user as any).id
    
    const participant = submitVote(roomId, userId, vote)
    return NextResponse.json(participant)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 