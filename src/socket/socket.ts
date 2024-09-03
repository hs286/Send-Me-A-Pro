import Ws from "@adonisjs/websocket-client";

export class SocketConnection {
  ws: any;
  handler = null;
  isConnected: any;

  setHandler(handler: any) {
    this.handler = handler;
  }

  async connect() {
    const wssurl = process.env.REACT_APP_WS_ENDPOINT;
    // PRODUCTION
    this.ws = await Ws(wssurl, {
      reconnection: true,
    }).connect();
    // STAGING
    // this.ws = Ws("ws://3.238.229.142:8002/", { reconnection: true }).connect(); use this for staging
    //DEVELOPMENT
    //  this.ws = Ws("ws://localhost:4000/", { reconnection: true }).connect();

    this.ws.on("open", () => {
      console.log("Index initialized");
    });

    this.ws.on("close", () => {
      console.log("Index closed");
    });

    this.ws.on("error", (e: any) => {
      console.log("erororro closed", e);
    });

    return this;
  }

  subscribe(channel: any, handler: any) {
    if (!this.ws) {
      setTimeout(() => this.subscribe(channel, handler), 1000);
    } else {
      if (!this.ws.getSubscription(channel)) {
        const result = this.ws.subscribe(channel);

        if (result) {
          result.on("message", (message: any) => {
            // console.log("Incoming", message, "message");
            if (handler) handler(message);
          });

          result.on("error", (error: any) => {
            // console.log(error);
          });
        }
      }
    }
  }

  subscribeToLocation(roomId: string, handler: any) {
    console.log(this.ws);
    if (!this.ws) {
      this.connect();
      setTimeout(() => this.subscribeToLocation(roomId, handler), 1000);
    } else {
      if (!this.ws.getSubscription("location." + roomId)) {
        const result = this.ws.subscribe("location." + roomId);
        if (result) {
          result.on("location-" + roomId, (message: any) => {
            if (handler) handler(message);
          });

          result.on("error", (error: any) => {
            console.error("error=>", error);
          });
        }
      } else {
        const result = this.ws.getSubscription("location." + roomId);
        if (result) {
          result.on("location-" + roomId, (message: any) => {
            if (handler) handler(message);
          });

          result.on("error", (error: any) => {
            console.error("error=>", error);
          });
        }
      }
    }
  }

  sendMessage(roomId: any, msg: any, withUserId: any, newCreatedRoom = false) {
    if (!this.ws) {
      //setTimeout(() => this.sendMessage(channel), 1000);
    } else {
      const resultWithRoom = this.ws.getSubscription(`room.${roomId}`);
      if (!resultWithRoom) {
        this.subscribe(`room.${roomId}`, this.handler);
        return;
      }
      if (resultWithRoom) resultWithRoom.emit("message", msg);
      const resultWithBroadcast = this.ws.getSubscription(
        `chatList.${withUserId.toString()}`
      );
      if (!resultWithBroadcast) {
        this.subscribe(`chatList.${withUserId.toString()}`, null);
        return;
      }
      if (resultWithBroadcast) {
        resultWithBroadcast.emit("newMessage", {
          state: "Notification",
          data: {
            room_id: roomId,
            // sender: room.fromUser
          },
        });
      }
    }
  }

  subscribeToBroadcast(channel: any, handler: any) {
    if (!this.ws) {
      setTimeout(() => this.subscribe(channel, handler), 1000);
    } else {
      const result = this.ws.subscribe(channel);

      if (result) {
        result.on("newMessage", (message: any) => {
          // console.log("Incoming", message, "newMessage");
          handler(message);
        });
        result.on("error", (error: any) => {
          console.log(error);
        });
      }
    }
  }

  readMessage(roomId: any, messageId: any, userId: any) {
    if (!this.ws) {
    } else {
      const result = this.ws.getSubscription(`room.${roomId}`);

      if (result) {
        result.emit("read", {
          state: "Read",
          data: {
            _id: messageId,
            roomId: roomId,
            from: userId,
          },
        });
        result.on("error", (error: any) => {
          console.log(error);
        });
      }
    }
  }

  unsubscribe(roomId: any) {
    if (!this.ws) {
    } else {
      const result = this.ws.getSubscription(`room.${roomId}`);
      if (result) {
        result.close();

        result.on("close", (error: any) => {
          // console.log("close the channel => roomId: =>", roomId);
        });

        result.on("error", (error: any) => {
          // console.log(error);
        });
      }
    }
  }

  answer(roomId: any, messageId: any, msg: any, withUserId: any) {
    if (!this.ws) {
      //setTimeout(() => this.answer(roomId, messageId, msg, withUserId), 1000);
    } else {
      const result = this.ws.getSubscription(`room.${roomId}`);
      // console.log("caleddddd in answerrr", result)
      if (result) {
        result.emit("answer", {
          state: "Answer",
          data: {
            _id: messageId,
            roomId: roomId,
          },
        });

        this.sendMessage(roomId, msg, withUserId);

        result.on("error", (error: any) => {
          // console.log(error);
        });
      }
    }
  }

  getConnectionOpen() {
    return this.isConnected;
  }
}

export default new SocketConnection();
