import * as WebSocket from "ws"
interface LoginMessage {
  type?: "login"
  userId: string
}

interface ChatMessage {
  type: "chat"
  fromUserId: string
  toUserId: string
  message: string
}

interface HeartbeatMessage {
  type: "heartbeat"
}

interface HeartbeatAckMessage {
  type: "heartbeatAck"
}

interface ErrorMessage {
  type: "error"
  message: string
}

type WebSocketMessage =
  | LoginMessage
  | ChatMessage
  | HeartbeatMessage
  | HeartbeatAckMessage
  | ErrorMessage
const wsServer = new WebSocket.Server({ port: 8080 })
const onlineUser = new Map<string, WebSocket>()

wsServer.on("connection", (socket: WebSocket) => {
  console.log("connection.....")
  let userId: string = ""

  socket.on("message", (data: WebSocket.Data) => {
    const msgData = JSON.parse(data.toString()) as LoginMessage
    if (msgData.type === "login") {
      userId = msgData.userId
      onlineUser.set(msgData.userId, socket)
      console.log(`${userId}logged in`)
    }
  })

  socket.on("close", () => {
    onlineUser.delete(userId)
    console.log(`${userId}is logged out`)
  })

  socket.on("message", (data: WebSocket.Data) => {
    const msgData = JSON.parse(data.toString()) as WebSocketMessage
    switch (msgData.type) {
      case "chat":
        const toUserId = msgData.toUserId
        if (toUserId && onlineUser.has(toUserId)) {
          onlineUser
            .get(toUserId)!
            .send(
              JSON.stringify({
                type: "chat",
                fromUserId: userId,
                toUserId: toUserId,
                message: msgData.message,
              })
            )
        } else {
          socket.send(
            JSON.stringify({
              type: "error",
              message: `${toUserId} is not online`,
            } as ErrorMessage)
          )
        }
        break
      case "heartbeat":
        socket.send(JSON.stringify({ type: "heartbeatAck" } as HeartbeatAckMessage))
        break
    }
  })
  const heartbeatInterval = setInterval(() => {
    socket.send(JSON.stringify({ type: "heartbeat" } as HeartbeatMessage))
  }, 5000)
  socket.on("close", () => {
    clearInterval(heartbeatInterval)
  })
  console.log("server is running");
})
