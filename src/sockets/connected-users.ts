type SocketDictionary = Record<string, string>;

export class ConnectedUsers {
  private static connectedUsers: SocketDictionary = {};

  public static getSocketIdByUserId(userId: string): string | undefined {
    return ConnectedUsers.connectedUsers[userId];
  }

  public static setSocketId(userId: string, socketId: string) {
    if (!userId) return console.log('User Id was not provided')
    ConnectedUsers.connectedUsers[userId] = socketId;
  }
  
  public static removeConnectedUserByUserId(userId: string) {
    if(!userId) return console.log('User Id was not provided')
    delete ConnectedUsers.connectedUsers[userId]
  }

  public static removeConnectedUserBySocketId(socketId: string) {
    let userIdToRemove: string | null = null;

    for(const userId in ConnectedUsers.connectedUsers) {
      if(ConnectedUsers.connectedUsers[userId] === socketId) {
        userIdToRemove = userId;
        break;
      }
    }

    if(userIdToRemove) {
      delete ConnectedUsers.connectedUsers[userIdToRemove]
    } else {
      console.log('usuario no encontrado', socketId)
    }
  }

  public static getAll(): SocketDictionary {
    return ConnectedUsers.connectedUsers;
  }
}