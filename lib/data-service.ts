import { v4 as uuidv4 } from 'uuid';

// In-memory data store (replace with database in production)
let rooms: any[] = [];
let participants: any[] = [];

export function createRoom(name: string, description: string, ownerId: string) {
  const room = {
    id: uuidv4(),
    name,
    description,
    ownerId,
    active: true,
    revealed: false,
    currentTask: null,
    createdAt: new Date(),
    participants: [],
  };
  
  rooms.push(room);
  return room;
}

export function getRoom(roomId: string) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    throw new Error('Room not found');
  }
  return room;
}

export function getUserRooms(userId: string) {
  return rooms.filter(room => room.ownerId === userId);
}

export function getParticipatingRooms(userId: string) {
  const participantRoomIds = participants
    .filter(p => p.userId === userId)
    .map(p => p.roomId);
  
  return rooms.filter(room => 
    participantRoomIds.includes(room.id) && room.ownerId !== userId
  );
}

export function addParticipant(roomId: string, userId: string, name: string, image: string | null) {
  const room = getRoom(roomId);
  
  // Check if user is already a participant
  const existingParticipant = participants.find(
    p => p.roomId === roomId && p.userId === userId
  );
  
  if (existingParticipant) {
    return room;
  }
  
  const participant = {
    id: uuidv4(),
    roomId,
    userId,
    vote: null,
    user: {
      name,
      image,
    },
  };
  
  participants.push(participant);
  
  // Update room's participants
  room.participants = participants.filter(p => p.roomId === roomId);
  
  return room;
}

export function submitVote(roomId: string, userId: string, vote: string) {
  const room = getRoom(roomId);
  
  if (room.revealed) {
    throw new Error('Cannot vote when votes are revealed');
  }
  
  const participant = participants.find(
    p => p.roomId === roomId && p.userId === userId
  );
  
  if (!participant) {
    throw new Error('Participant not found');
  }
  
  participant.vote = vote;
  
  return participant;
}

export function revealVotes(roomId: string) {
  const room = getRoom(roomId);
  room.revealed = true;
  return room;
}

export function resetVotes(roomId: string) {
  const room = getRoom(roomId);
  room.revealed = false;
  
  // Reset all votes for this room
  participants
    .filter(p => p.roomId === roomId)
    .forEach(p => {
      p.vote = null;
    });
  
  return room;
}

export function setTask(roomId: string, task: string) {
  const room = getRoom(roomId);
  room.currentTask = task;
  return room;
} 