import moment from "moment";

const getInfoUser = (id = 0, info: any) => {
  if (info) {
    const { fromUser, withUser } = info;
    if (fromUser.id === id) {
      return {
        name: fromUser.firstname + " " + fromUser.lastname,
        avatar: fromUser.avatar,
      };
    } else if (withUser.id === id) {
      return {
        name: withUser.firstname + " " + withUser.lastname,
        avatar: withUser.avatar,
      };
    }
  }
};

const getMapMessage = (msg: any, res: any) => {
  const info = getInfoUser(msg.data.sender, res);
  let body = msg.data.message.body;
  if (msg.data.message.type === "button") {
    // let date =  msg.data.message.data.RequestOpportunityData.date || ""
    let message = msg?.data?.message?.data?.sessionData?.message || "";
    let location = msg?.data?.message?.data?.sessionData?.location || "";
    let sessionTime = msg?.data?.message?.data?.sessionData?.sessionTime || "";
    let coordinate = msg?.data?.message?.data?.sessionData?.coordinate || "";
    let category = msg?.data?.message?.data?.sessionData?.category || "";
    let packageType = msg?.data?.message?.data?.sessionData?.packageType || "";
    let userName = msg?.data?.message?.data?.sessionData?.user || "";
    let trainerName = msg?.data?.message?.data?.sessionData?.trainer || "";
    let obj = {
      date: `${moment(sessionTime)?.format("dddd, MMMM Do YYYY")}`,
      time: `${moment(sessionTime)?.format("h:mm A")}`,
      location: `${location}`,
      message: `${message}`,
      coordinates: coordinate,
      category,
      packageType,
      sessionTime,
      userName,
      trainerName,
    };
    body = JSON.stringify(obj);
  }
  if (msg.data.message.type === "hireTrainer") {
    return {
      _id: msg.data._id,
      text: body,
      createdAt: msg.data._id,
      type: msg.data.message.type,
      bodyHeader: msg.data.message.bodyHeader,
      requestId: msg.data.message.data.RequestOpportunityId,
      user: {
        _id: msg.data.sender,
        name: (info && info.name) || "NoName",
        avatar: (info && info.avatar) || "",
      },
    };
  }
  if (msg.data.message.type === "disapproveSession") {
    return {
      _id: msg.data._id,
      text: body,
      createdAt: msg.data._id,
      type: msg.data.message.type,
      bodyHeader: msg.data.message.bodyHeader,
      requestId: msg.data.message.data.RequestOpportunityId,
      sessionData: msg.data.message.data.sessionData,
      rating: msg.data.message.rating ? msg?.data?.message?.rating : null,
      user: {
        _id: msg.data.sender,
        name: (info && info.name) || "NoName",
        avatar: (info && info.avatar) || "",
      },
    };
  }
  return {
    _id: msg.data._id,
    text: body,
    type: msg.data.message.type,
    createdAt: msg.data._id,
    user: {
      _id: msg.data.sender,
      name: (info && info.name) || "NoName",
      avatar: (info && info.avatar) || "",
    },
  };
};

export { getInfoUser, getMapMessage };
