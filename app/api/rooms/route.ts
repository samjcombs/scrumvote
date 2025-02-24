import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { createRoom, getUserRooms } from '@/lib/data-service'

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const userId = (session.user as any).id
  const rooms = getUserRooms(userId)
  
  return NextResponse.json(rooms)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { name, description } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 })
    }
    
    const userId = (session.user as any).id
    const room = createRoom(name, description || '', userId)
    
    return NextResponse.json(room)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 