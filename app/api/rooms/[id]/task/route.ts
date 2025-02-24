import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getRoom, setTask } from '@/lib/data-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { task } = await request.json()
    
    const room = getRoom(params.id)
    
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    
    if (room.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Only room owner can set task' }, { status: 403 })
    }
    
    // Set task
    const updatedRoom = setTask(params.id, task)
    
    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error('Error setting task:', error)
    return NextResponse.json({ error: 'Failed to set task' }, { status: 500 })
  }
} 