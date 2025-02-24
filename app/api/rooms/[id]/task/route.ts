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
  
  const roomId = params.id
  
  try {
    const { task } = await request.json()
    
    if (!task) {
      return NextResponse.json({ error: 'Task is required' }, { status: 400 })
    }
    
    const room = getRoom(roomId)
    
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    
    const userId = (session.user as any).id
    
    if (room.ownerId !== userId) {
      return NextResponse.json({ error: 'Only room owner can set task' }, { status: 403 })
    }
    
    const updatedRoom = setTask(roomId, task)
    return NextResponse.json(updatedRoom)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 