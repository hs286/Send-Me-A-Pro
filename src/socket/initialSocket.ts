import socket from "./index";
// import { ToastAndroid } from 'react-native'
// import { getData } from '../utils/storage'

export async function connectToSocket(handler: any) {
  try {
    socket.connection.connect();
    const userId = JSON.parse(localStorage.getItem("userData") || "").id;

    socket.connection.subscribeToBroadcast(`chatList.${userId}`, handler);
  } catch (e) {
    console.log(e, "error in  connectToSocket");
    // ToastAndroid.show("error in  connectToSocket", ToastAndroid.LONG);
  }
}

export const getInfoUser = (id = 0, info: any) => {
  if (info) {
    const { fromUser, withUser } = info;
    if (fromUser.id === id) {
      return {
        name: fromUser.firstname + " " + fromUser.lastname,
        avatar: fromUser.avatar,
      };
    } else if (withUser.id === id) {
      return {
        name: fromUser.firstname + " " + fromUser.lastname,
        avatar: fromUser.avatar,
      };
    }
  }
};

export function getMapMessage(msg: any, res: any) {
  const info = getInfoUser(msg.data.sender, res);
  let body = msg.data.message.body;
  if (msg.data.message.type === "button") {
    let message = msg.data.message.data.RequestOpportunityData.message || "";
    body = `You've been Hired!\nMessage:\n${message}`;
  }
  return {
    _id: msg.data._id,
    text: body,
    createdAt: msg.data._id,
    user: {
      _id: msg.data.sender,
      name: (info && info.name) || "NoName",
      avatar: (info && info.avatar) || "",
    },
  };
}

export function generatorMessage(
  text: any,
  myUserID: any,
  userId: any,
  myUserName: any,
  type: string
) {
  return {
    data: {
      _id: new Date(),
      sender: parseInt(myUserID),
      receiver: userId,
      senderUserName: myUserName,
      message: {
        body: text,
        type: type || "text",
      },
    },
    state: "Message",
  };
}
