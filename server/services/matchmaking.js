// Matchmaking service - pairs users randomly
export class MatchmakingService {
  constructor() {
    this.waitingQueue = [];
  }
  
  addToQueue(socket) {
    // Check if already in queue
    if (!this.waitingQueue.find(s => s.id === socket.id)) {
      this.waitingQueue.push(socket);
      console.log(`Added ${socket.id} to queue. Queue size: ${this.waitingQueue.length}`);
    }
  }
  
  removeFromQueue(socketId) {
    const index = this.waitingQueue.findIndex(s => s.id === socketId);
    if (index !== -1) {
      this.waitingQueue.splice(index, 1);
      console.log(`Removed ${socketId} from queue. Queue size: ${this.waitingQueue.length}`);
    }
  }
  
  findMatch(socket) {
    // Don't match with self
    const availableUsers = this.waitingQueue.filter(s => 
      s.id !== socket.id && 
      s.connected && 
      !s.data.partnerId
    );
    
    if (availableUsers.length === 0) {
      return null;
    }
    
    // Random match
    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    const match = availableUsers[randomIndex];
    
    // Remove matched user from queue
    this.removeFromQueue(match.id);
    
    return match;
  }
  
  getQueueSize() {
    return this.waitingQueue.length;
  }
}
