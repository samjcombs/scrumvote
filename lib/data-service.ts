import { v4 as uuidv4 } from 'uuid';

// In-memory storage
export const rooms = new Map();
export const participants = new Map();

// Room functions
export function createRoom(name, description, ownerId) {
  const id = uuidv4();
  const room = {
    id,
    name,
    description,
    ownerId,
    createdAt: new Date(),
    active: true,
    currentTask: null,
    revealed: false,
    participants: []
  };
  
  rooms.set(id, room);
  return room;
}

export function getRoom(id) {
  return rooms.get(id);
}

export function getUserRooms(userId) {
  return Array.from(rooms.values()).filter(room => room.ownerId === userId);
}

export function getParticipatingRooms(userId) {
  const userParticipations = Array.from(participants.values())
    .filter(p => p.userId === userId)
    .map(p => p.roomId);
    
  return Array.from(rooms.values())
    .filter(room => userParticipations.includes(room.id) && room.ownerId !== userId);
}

// Participant functions
export function addParticipant(userId, roomId, userName, userImage) {
  const id = uuidv4();
  const participantKey = `${userId}-${roomId}`;
  
  if (participants.has(participantKey)) {
    return participants.get(participantKey);
  }
  
  const participant = {
    id,
    userId,
    roomId,
    joinedAt: new Date(),
    vote: null,
    isActive: true,
    user: {
      name: userName,
      image: userImage
    }
  };
  
  participants.set(participantKey, participant);
  
  // Add to room's participants list
  const room = rooms.get(roomId);
  if (room) {
    room.participants.push(participant);
  }
  
  return participant;
}

export function submitVote(userId, roomId, vote) {
  const participantKey = `${userId}-${roomId}`;
  const participant = participants.get(participantKey);
  
  if (participant) {
    participant.vote = vote;
    return participant;
  }
  
  return null;
}

export function revealVotes(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    room.revealed = true;
    return room;
  }
  return null;
}

export function resetVotes(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    room.revealed = false;
    
    // Reset all votes for this room
    room.participants.forEach(p => {
      p.vote = null;
    });
    
    return room;
  }
  return null;
}

export function setTask(roomId, task) {
  const room = rooms.get(roomId);
  if (room) {
    room.currentTask = task;
    room.revealed = false;
    
    // Reset all votes for this room
    room.participants.forEach(p => {
      p.vote = null;
    });
    
    return room;
  }
  return null;
} 