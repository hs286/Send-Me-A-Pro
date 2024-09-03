import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Offcanvas,
  Overlay,
  Popover,
  Row,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";
import {
  faSearch,
  faCalendar,
  faClock,
  faGrip,
  faBoxOpen,
  faLocationDot,
  faMessage,
  // faSmile,
  faPlus,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, getChatListAction, getChatWithAction } from "../../redux";
import { ChatStartWith } from "../../redux/modals/Chat";
import socket from "../../socket/socket";
import { getMapMessage } from "./helpers";
import { RUNNER_IMAGE_BLACK } from "../../assets/images";
import moment from "moment";
import StarRatings from "react-star-ratings";
import GoogleMapReact from "google-map-react";
import { useParams } from "react-router-dom";
import { generatorMessage } from "../../socket/initialSocket";
import { useGeolocated } from "react-geolocated";
import { useLogicPackage } from "../../hooks";

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const { profile } = useSelector((state: any) => state.user);
  const { chatList } = useSelector((state: any) => state.chat);

  const ref = useRef(null);

  const { checkUserHasActivePackage } = useLogicPackage();

  const [selectedSection, setSelectedSection] = useState<string>("pros");
  const [threads, setThreads] = useState([]);
  const [supportThreads, setSupportThreads] = useState([]);
  const [threadsClone, setThreadsClone] = useState([]);
  const [supportThreadsClone, setSupportThreadsClone] = useState([]);
  const [chat, setChat] = useState<ChatStartWith>();
  const [messages, setMessages] = useState<Array<any>>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showThreadsCanvas, setShowThreadsCanvas] = useState<boolean>(false);
  const { id, firstname, lastname, with_whom } = useParams();
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [isProsSectionBlocked, setIsProsSectionBlocked] =
    useState<boolean>(false);
  const [blockMessagesContainer, setBlockMessagesContainer] =
    useState<boolean>(false);

  const setDefaultSelectedSection = useCallback(
    async () => {
      if ((await checkUserHasActivePackage()) && with_whom !== "support") {
        setIsProsSectionBlocked(false);
        onChangeTab("pros");
      } else {
        setIsProsSectionBlocked(true);
        onChangeTab("support");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile?.id]
  );

  useEffect(() => {
    let list: any =
      selectedSection === "pros" ? threadsClone : supportThreadsClone;
    if (searchText !== "") {
      let a = list?.filter((chat: any) => {
        const withUserId =
          typeof chat?.withUser?.id === "string"
            ? JSON.parse(chat?.withUser?.id)
            : chat?.withUser?.id;
        const propsUser =
          typeof profile?.id === "string"
            ? JSON.parse(profile?.id)
            : profile?.id;
        const user = withUserId === propsUser ? chat?.fromUser : chat?.withUser;
        if (chat?.chatWithAdmin) {
          let b = "smat hq";
          if (user?.roles[0]?.name?.includes("FA")) {
            return `${user?.firstname} ${user?.lastname}`
              .toLowerCase()
              .includes(searchText?.toLowerCase());
          } else {
            return b.includes(searchText?.toLowerCase());
          }
        } else {
          return (user?.firstname + " " + user?.lastname)
            .toLowerCase()
            .includes(searchText?.toLowerCase());
        }
      });
      if (selectedSection === "pros") {
        setThreads(a);
      } else {
        setSupportThreads(a);
      }
    } else {
      let prosThreads = chatList?.data?.filter(
        (trainer: any) => trainer?.chatWithAdmin === false
      );
      setThreads(prosThreads);
      setThreadsClone(prosThreads);

      let filteredData = chatList?.data?.filter(
        (trainer: any) => trainer?.chatWithAdmin === true
      );
      setSupportThreads(filteredData);
      setSupportThreadsClone(filteredData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatList?.data, profile?.id, searchText]);

  useEffect(() => {
    if (profile?.id) {
      setDefaultSelectedSection();
      dispatch(getChatListAction(profile?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  useEffect(() => {
    if (with_whom) {
      setSelectedSection(with_whom);
    }
  }, [with_whom]);

  const fetchMessages = async (user: any) => {
    if (user?.id) {
      setBlockMessagesContainer(true);
      let response: any = await dispatch(getChatWithAction(user?.id));
      setChat(response);
      const listMessage = response.messages.map((_message: any) => {
        return getMapMessage(_message.message, response);
      });
      if (listMessage?.length > 0) {
        setMessages(listMessage?.reverse());
      }
      setRoomId(response?.room);

      socket.setHandler((msg: any) => {
        let mapMessage = getMapMessage(msg, response);
        setMessages((listmessages: any) => [...listmessages, mapMessage]);
        // read each message
        socket.readMessage(response.room, msg.data._id, response.from);
      });

      socket.subscribe(`room.${response.room}`, (msg: any) => {
        let mapMessage = getMapMessage(msg, response);
        setMessages((listmessages: any) => [...listmessages, mapMessage]);

        // read each message
        socket.readMessage(response.room, msg.data._id, response.from);
      });

      socket.subscribe(`chatList.${user?.id}`, () => {});

      // read message when get call api (get message)

      if (response.messages && response.messages.length > 0) {
        socket.readMessage(
          response.room,
          response.messages[0].message.data._id,
          response.from
        );
      }
    }
    setBlockMessagesContainer(false);
  };

  useEffect(() => {
    if (id) {
      setSelectedUser({
        id,
        firstname,
        lastname,
      });
      fetchMessages({
        id,
        firstname,
        lastname,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSend = (msg: any) => {
    if (chat) {
      let newCreatedRoom = !(messages.length > 0);
      socket.sendMessage(
        chat.room,
        generatorMessage(
          msg.text || "",
          profile?.id,
          selectedUser?.id,
          "",
          msg?.type
        ),
        selectedUser?.id,
        newCreatedRoom
      );
      setText("");
    } else {
      // ToastAndroid.show('socket is not connected, Please retry...', ToastAndroid.LONG)
      console.log("Empty message");
    }

    // else {
    //     if (!socket.getConnectionOpen()) {
    //         // ToastAndroid.show('socket is not connected, Please retry...', ToastAndroid.LONG)
    //         console.log("disconnected socket")
    //         socket.connect();
    //         if (chat) {
    //             let newCreatedRoom = !(messages.length > 0)
    //             socket.sendMessage(
    //               chat.room,
    //               generatorMessage(msg.text || '', profile?.id, selectedUser?.id, ""),
    //               selectedUser?.id,
    //               newCreatedRoom
    //           );
    //         }
    //     }
    //     else if (!msg) {
    //         // ToastAndroid.show('socket is not connected, Please retry...', ToastAndroid.LONG)
    //     }

    // }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  const handleNavigateCurrentLocation = (lat: number, lng: number) => {
    window.open(`${window.location.origin}/current-location/${lat}/${lng}`);
  };

  const handleNavigateLiveLocation = (
    lat: number,
    lng: number,
    roomId: string
  ) => {
    window.open(
      `${window.location.origin}/live-location/${lat}/${lng}/${roomId}`
    );
  };

  const cleanup = () => {
    if (roomId) {
      socket.unsubscribe(roomId);
    }
    setRoomId("");
  };

  const shareCurrentLocation = (msg: any) => {
    onSend(msg);
  };

  const selectUserToChat = (user: any) => {
    setSelectedUser(user);
    setShowThreadsCanvas(false);
    fetchMessages(user);
  };

  const handleAddToCalendar = (calendarEvent: any) => {
    const encodedUrl = encodeURI(
      [
        "https://www.google.com/calendar/render",
        "?action=TEMPLATE",
        `&text=${calendarEvent.title || ""}`,
        `&dates=${calendarEvent.startDate || ""}`,
        // `/${calendarEvent.endDate || ''}`,
        // `&details=${`${calendarEvent.description}\n` + `https://cemkiray.com` || ''}`,
        `&location=${calendarEvent.address || ""}`,
        "&sprop=&sprop=name:",
      ].join("")
    );
    window.open(encodedUrl);
  };

  const handleViewOnMap = (coodinate: string) => {
    const encodedUrl = encodeURI(
      ["https://maps.google.com?q=", coodinate].join("")
    );
    window.open(encodedUrl);
  };

  const getLastMessage = (thread: any) => {
    const msgType: string =
      (thread?.messages &&
        thread?.messages?.length > 0 &&
        thread?.messages[0]?.message?.data?.message?.type) ||
      "text";
    if (msgType === "currentLocation" || msgType === "liveLocation") {
      return "Location";
    } else if (
      thread?.messages &&
      thread?.messages?.length > 0 &&
      thread?.messages[0]?.message?.data?.message?.bodyHeader
    ) {
      return (
        thread?.messages &&
        thread?.messages?.length > 0 &&
        thread?.messages[0]?.message?.data?.message?.bodyHeader
      );
    } else if (
      thread?.messages &&
      thread?.messages?.length > 0 &&
      thread?.messages[0]?.message?.data?.message?.body
    ) {
      return (
        thread?.messages &&
        thread?.messages?.length > 0 &&
        thread?.messages[0]?.message?.data?.message?.body
      );
    }
    return "";
  };

  const renderChatThread = (user: any, thread: any, index: number) => {
    return (
      <li
        className="d-flex align-items-center"
        onClick={() => selectUserToChat(user)}
        key={index}
      >
        <Image
          src={user?.avatar || RUNNER_IMAGE_BLACK}
          width={40}
          height={40}
          className={`rounded-circle border-color-primary smat-thread-avatar ${
            user?.avatar ? "" : "p-1"
          }`}
        />
        <div className="ms-2">
          <p className="p-0 m-0">
            {user?.firstname + " " + user?.lastname?.charAt(0) + "."}
          </p>
          <p className="p-0 m-0 smat-thread-last-message color-secondary text-truncate">
            {getLastMessage(thread)}
          </p>
        </div>
      </li>
    );
  };

  const renderChatMessageAvatar = (message: any) => {
    return (
      <Col xs="2" md="1">
        <Image
          src={message?.user?.avatar || RUNNER_IMAGE_BLACK}
          alt="trainer"
          className={`chat-message-image ${message?.user?.avatar ? "" : "p-1"}`}
          roundedCircle
        />
      </Col>
    );
  };

  const handleClick = (event: any) => {
    setShow(!show);
    setTarget(event.target);
  };

  const renderTextMessage = (message: string) => {
    return <p className="p-0 m-0">{message}</p>;
  };

  const renderButtonMessage = (message: any) => {
    const msg = JSON.parse(message.text);
    return (
      <>
        <span className="system-text">This is system generated message.</span>
        <h5 className="mt-3">
          {msg?.userName !== ""
            ? `Admin has hired ${msg.trainerName?.split(" ")[0]} ${
                msg.trainerName?.split(" ")[1]?.charAt(0) + "."
              } on behalf of ${msg.userName}`
            : `${profile?.firstname} ${
                profile?.lastname?.charAt(0) + "."
              } hired ${msg.userName}`}
        </h5>
        <div className="w-100">
          <FontAwesomeIcon icon={faCalendar} className="message-icons" />
          <span className="ms-2"> {msg?.date} </span>
        </div>

        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faClock} className="message-icons" />
          <span className="ms-2"> {msg?.time} </span>
          <Button
            className="no-background no-border"
            onClick={() =>
              handleAddToCalendar({
                title:
                  msg?.userName !== ""
                    ? `Admin has hired ${msg.trainerName} on behalf of ${msg.userName}`
                    : `${profile?.firstname} ${
                        profile?.lastname?.charAt(0) + "."
                      } hired ${msg.userName}`,
                address: msg?.location,
              })
            }
          >
            (Add to Calendar)
          </Button>
        </div>
        <p className="p-0 m-0">
          <FontAwesomeIcon icon={faGrip} className="message-icons" />{" "}
          <span className="ms-2"> {msg?.category?.name} </span>
        </p>
        <p className="p-0 m-0">
          <FontAwesomeIcon icon={faBoxOpen} className="message-icons" />
          <span className="ms-2"> {msg?.packageType?.name} </span>
        </p>
        <p className="p-0 m-0">
          <FontAwesomeIcon icon={faLocationDot} className="message-icons" />
          <span
            className="ms-2 text-decoration-underline"
            role={"button"}
            onClick={() => handleViewOnMap(msg?.coordinates)}
          >
            {msg?.location}
          </span>
        </p>
        {msg?.message ? (
          <p className="p-0 m-0">
            <FontAwesomeIcon icon={faMessage} className="message-icons" />
            <span className="ms-2"> {msg?.message} </span>
          </p>
        ) : null}
        <span className="system-text mt-3">
          If you need to change your session time, please message the client in
          the client chat and notify the Admin in this chat.
        </span>
      </>
    );
  };

  const renderHireTrainer = (message: any) => {
    return (
      <>
        <h5 className="mt-1">{message?.bodyHeader}</h5>
        <p className="mt-2 hire-trainer-text">{message?.text}</p>
        <Row className="justify-content-between pb-2">
          <Button
            variant="primary"
            className="border-color-primary color-primary bg-transparent"
            style={{ width: "48%" }}
            onClick={() => {}}
          >
            PACKAGES
          </Button>
          <Button
            variant="primary"
            className="border-color-primary background-primary"
            style={{ width: "48%" }}
            onClick={() => {}}
          >
            HIRE ME
          </Button>
        </Row>
      </>
    );
  };

  const renderDisapproveSession = (message: any) => {
    return (
      <>
        <h5>{message?.bodyHeader}</h5>
        <div className="mt-1 session-logged-time-text">
          Session Logged On:{" "}
          {moment(message?.sessionData?.session_date).format(
            profile?.Country?.iso === "US"
              ? "ddd, MMM Do YYYY, h:mm A"
              : "ddd, Do MMM YYYY, h:mm A"
          )}
        </div>
        <div className="mt-1 session-logged-time-text">
          <span>
            <FontAwesomeIcon icon={faGrip} />{" "}
            <span className="ms-2">
              {" "}
              {message?.sessionData?.Categories?.name}{" "}
            </span>
          </span>
          <span className="ms-3">
            <FontAwesomeIcon icon={faBoxOpen} />
            <span className="ms-2">
              {" "}
              {message?.sessionData?.PackageType?.name}{" "}
            </span>
          </span>
        </div>
        <div className="mt-1">
          Review: {message?.text !== "null" ? message?.text : "N/A"}
        </div>
        <div className="d-flex align-items-center">
          <span className="mt-1">Rating:</span>
          <span className="ms-2">
            {
              <StarRatings
                rating={message?.rating ? message.rating : 5}
                starRatedColor="#fff"
                starHoverColor="#fff"
                starEmptyColor="#fff"
                numberOfStars={5}
                starDimension="15px"
                starSpacing="3px"
                name="rating"
              />
            }
          </span>
        </div>
      </>
    );
  };

  const Marker = (props: any) => {
    return (
      <FontAwesomeIcon
        style={{ fontSize: "20px" }}
        icon={faLocationDot}
        color="red"
      />
    );
  };

  const renderCurrentLocation = (message: any) => {
    const coords = JSON.parse(message?.text);
    return (
      <>
        <div
          style={{ width: "100%", height: "150px" }}
          className="rounded overflow-hidden mt-2 mb-2"
          role="button"
          onClick={() =>
            handleNavigateCurrentLocation(coords?.lat, coords?.lng)
          }
        >
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyCbjJnTaH7q_Fi1ghtHpPf9KphpROoumpc",
              language: "en",
            }}
            defaultCenter={{
              lat: coords?.lat,
              lng: coords?.lng,
            }}
            defaultZoom={12}
            options={{
              fullscreenControl: false,
              zoomControl: false,
              scrollwheel: false,
              draggable: false,
            }}
          >
            <Marker lat={coords?.lat} lng={coords?.lng} />
          </GoogleMapReact>
        </div>
        <span className="current-location-text">
          {message?.user?.name} has shared location.{" "}
        </span>
      </>
    );
  };

  const renderLiveLocation = (message: any) => {
    const coords = JSON.parse(message?.text);
    return (
      <>
        <div
          style={{ width: "100%", height: "150px" }}
          className="rounded overflow-hidden mt-2 mb-2"
          role="button"
          onClick={() =>
            handleNavigateLiveLocation(coords?.lat, coords?.lng, roomId)
          }
        >
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyCbjJnTaH7q_Fi1ghtHpPf9KphpROoumpc",
              language: "en",
            }}
            defaultCenter={{
              lat: coords?.lat,
              lng: coords?.lng,
            }}
            defaultZoom={12}
            options={{
              fullscreenControl: false,
              zoomControl: false,
              scrollwheel: false,
              draggable: false,
            }}
          >
            <Marker lat={coords?.lat} lng={coords?.lng} />
          </GoogleMapReact>
        </div>
        <span className="current-location-text">
          {message?.user?.name} is sharing live location.{" "}
        </span>
      </>
    );
  };

  const getMessage = (message: any) => {
    if (message.type === "text") return renderTextMessage(message.text);
    if (message.type === "button") return renderButtonMessage(message);
    if (message.type === "hireTrainer") return renderHireTrainer(message);
    if (message.type === "disapproveSession")
      return renderDisapproveSession(message);
    if (message.type === "currentLocation")
      return renderCurrentLocation(message);
    if (message.type === "liveLocation") return renderLiveLocation(message);
    return <span>{message.type}</span>;
  };

  const renderMessage = (message: any, index: number) => {
    // right bubble || logged in user message
    if (profile?.id === message?.user?._id) {
      return (
        <Row key={index} className="p-2 align-items-end justify-content-end">
          <Col className="d-flex justify-content-end" xs="10" md="11">
            <div className="right-bubble text-right background-primary">
              {getMessage(message)}
            </div>
          </Col>
          {renderChatMessageAvatar(message)}
        </Row>
      );
    } else {
      // left bubble || other user message
      return (
        <Row key={index} className="p-2 align-items-end">
          {renderChatMessageAvatar(message)}
          <Col xs="10" md="11">
            <div className="left-bubble text-left background-secondary ms-3 ms-sm-0">
              {getMessage(message)}
            </div>
          </Col>
        </Row>
      );
    }
  };

  const getFranchiseName = () => {
    if (
      profile?.Franchise &&
      profile?.Franchise.length > 0 &&
      profile?.Franchise[0]?._Franchise?.user?.firstname &&
      profile?.Franchise[0]?._Franchise?.user?.lastname
    ) {
      return `${profile?.Franchise[0]?._Franchise?.user?.firstname} ${profile?.Franchise[0]?._Franchise?.user?.lastname}`;
    } else if (
      profile?.Franchise &&
      profile?.Franchise.length > 0 &&
      profile?.Franchise[0]?._Franchise &&
      profile?.Franchise[0]?._Franchise.name
    ) {
      return profile?.Franchise[0]?._Franchise.name;
    }
    return "";
  };

  const getFranchiseAvatar = () => {
    if (
      profile?.Franchise &&
      profile?.Franchise.length > 0 &&
      profile?.Franchise[0]?._Franchise?.user?.avatar
    ) {
      return profile?.Franchise[0]?._Franchise?.user?.avatar;
    }
    return "";
  };

  const onChangeTab = (sectionName: string) => {
    setSearchText("");
    if (sectionName === "support") {
      const _userID =
        (profile?.Franchise &&
          profile?.Franchise.length > 0 &&
          profile?.Franchise[0]._Franchise &&
          profile?.Franchise[0]._Franchise.admin) ||
        0;

      setSelectedUser({
        id: _userID,
        firstname: getFranchiseName(),
        avatar: getFranchiseAvatar(),
        lastname: "",
      });
      fetchMessages({
        id: _userID,
        firstname: getFranchiseName(),
        lastname: "",
      });
      setSelectedSection(sectionName);
    } else {
      setSelectedSection(sectionName);
    }
  };

  const renderMessageThreads = () => {
    return (
      <Row className="border rounded-5 h-100" style={{ width: "99%" }}>
        <Col className="h-100">
          {/* tabs */}
          <Row className="p-3">
            <Col
              role="button"
              onClick={() => {
                !isProsSectionBlocked && onChangeTab("pros");
                setSelectedUser(null);
              }}
              className="text-start"
            >
              <span
                className={`${
                  selectedSection === "pros" && "selected-section"
                } ${isProsSectionBlocked && "disabled-section"}`}
              >
                PROS
              </span>
            </Col>
            <Col
              role="button"
              onClick={() => {
                onChangeTab("support");
              }}
              className="text-end"
            >
              <span
                className={`${
                  selectedSection === "support" && "selected-section"
                }`}
              >
                SUPPORT
              </span>
            </Col>
          </Row>
          {/* search input */}
          <Row>
            <Col className="h-100">
              <InputGroup className="rounded-pills">
                <Form.Control
                  placeholder="Search Pro"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  className="smat-seach-input-form-control"
                />
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  className="smat-search-btn"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup>
            </Col>
          </Row>
          {/* tab content */}
          <Row style={{ height: "83%" }}>
            {selectedSection === "pros" ? (
              <Col className="h-100 p-0 smat-threads-col">
                {threads?.length ? (
                  <ul className="smat-thread-ul">
                    {threads?.map((thread: any, index: number) => {
                      const user =
                        thread?.withUser?.id === profile?.id
                          ? thread.fromUser
                          : thread.withUser;
                      return renderChatThread(user, thread, index);
                    })}
                  </ul>
                ) : (
                  <div className="h-100 w-100 d-flex justify-content-center align-items-center flex-column">
                    <Image src={RUNNER_IMAGE_BLACK} width={70} />
                    <p className="mt-2">Nothing found!</p>
                  </div>
                )}
              </Col>
            ) : (
              <Col className="h-100 p-0 smat-threads-col">
                {supportThreads?.length ? (
                  <ul className="smat-thread-ul">
                    {supportThreads?.map((thread: any, index: number) => {
                      const user =
                        thread?.withUser?.id === profile?.id
                          ? thread.fromUser
                          : thread.withUser;
                      return renderChatThread(user, thread, index);
                    })}
                  </ul>
                ) : (
                  <div className="h-100 w-100 d-flex justify-content-center align-items-center flex-column">
                    <Image src={RUNNER_IMAGE_BLACK} width={70} />
                    <p className="mt-2">Nothing found!</p>
                  </div>
                )}
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    );
  };

  const renderThreadOffCanvas = () => {
    return (
      <Offcanvas
        scroll={false}
        show={showThreadsCanvas}
        // id="mobile-filter"
        onHide={() => setShowThreadsCanvas(false)}
      >
        <Offcanvas.Header closeButton>Messages</Offcanvas.Header>
        <Offcanvas.Body className="d-flex justify-content-center">
          {renderMessageThreads()}
        </Offcanvas.Body>
      </Offcanvas>
    );
  };

  return (
    <Container className="mt-3 min-height-vh-75">
      <Row className="chat-main-row">
        <Col xl="3" xxl="3" className="chat-thread-containcer h-100">
          {renderMessageThreads()}
        </Col>
        <Col
          xs="12"
          xl="9"
          xxl="9"
          className="border rounded-5 h-100 chat-messages-container"
        >
          {blockMessagesContainer ? (
            <div
              className="w-100 h-100 d-flex justify-content-center align-items-center"
              style={{
                position: "absolute",
                backgroundColor: "rgba(255,255,255,0.5)",
              }}
            >
              <Spinner animation="grow" variant="info" />
            </div>
          ) : null}
          <Row className={"smat-chat-list-header p-2 border-bottom"}>
            <Col>
              <FontAwesomeIcon
                onClick={() => setShowThreadsCanvas(!showThreadsCanvas)}
                className="chat-threads-hamburger me-3"
                icon={faBars}
              />
              {selectedUser ? (
                <>
                  <Image
                    src={selectedUser?.avatar || RUNNER_IMAGE_BLACK}
                    className={`rounded-circle chat-list-header-avatar border-color-primary ${
                      selectedUser?.avatar ? "" : "p-1"
                    }`}
                  />
                  <span className="ps-3">
                    {selectedUser?.firstname +
                      " " +
                      selectedUser?.lastname?.charAt(0) +
                      "."}
                  </span>
                </>
              ) : null}
            </Col>
          </Row>
          <Row className="smat-chat-message-row">
            {!selectedUser ? (
              <Col className="h-100 w-100 d-flex align-items-center justify-content-center flex-column">
                <Image src={RUNNER_IMAGE_BLACK} width={100} />
                <h2 className="text-center">
                  Write a message and book a session
                </h2>
                <p>Or search for other Pros</p>
                <Button className="background-primary border-color-primary rounded-pill ps-5 pe-5">
                  Search
                </Button>
              </Col>
            ) : (
              <Col>
                {messages?.length > 0 &&
                  messages?.map((message: any, index: number) => {
                    return renderMessage(message, index);
                  })}
              </Col>
            )}
          </Row>
          {selectedUser ? (
            <Row className="smat-chat-message-composer-row mt-2 mb-4">
              <InputGroup className="rounded-pills">
                <Form.Control
                  className="smat-seach-input-form-control"
                  as={"textarea"}
                  style={{ resize: "none" }}
                  value={text}
                  onKeyDown={(event: any) => {
                    if (event.keyCode === 13 && !event.shiftKey) {
                      if (text.length > 0) {
                        onSend({
                          text: text,
                          user: profile,
                          _id: 111,
                        });
                      }
                      event.preventDefault();
                    }
                  }}
                  onChange={(event) => {
                    console.log(event);
                    setText(event.target.value);
                  }}
                />

                {/* <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  className="smat-search-btn"
                >
                  <FontAwesomeIcon icon={faSmile} />
                </Button> */}

                <div
                  className="d-flex"
                  onClick={(event: any) => handleClick(event)}
                  ref={ref}
                >
                  <Button
                    variant="outline"
                    id="button-addon2"
                    className="smat-search-btn"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                  <Overlay
                    show={show}
                    target={target}
                    placement="top-end"
                    containerPadding={20}
                  >
                    <Popover id="popover-contained">
                      <Popover.Body>
                        <ul className="smat-menu-ul m-0">
                          <li
                            onClick={() => {
                              if (coords?.latitude && coords?.longitude) {
                                shareCurrentLocation({
                                  text: JSON.stringify({
                                    lat: coords?.latitude,
                                    lng: coords?.longitude,
                                  }),
                                  user: profile,
                                  _id: "",
                                  type: "currentLocation",
                                });
                              }
                            }}
                          >
                            <FontAwesomeIcon
                              color="#06bed8"
                              size={"1x"}
                              icon={faLocationDot}
                            />
                            <span>Location</span>
                          </li>
                        </ul>
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                </div>
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  disabled={text === ""}
                  className="smat-search-btn"
                  onClick={() => onSend({ text, user: profile, _id: 111 })}
                >
                  <span className="color-primary">Send</span>
                </Button>
              </InputGroup>
            </Row>
          ) : null}
        </Col>
      </Row>
      {renderThreadOffCanvas()}
    </Container>
  );
};

export { Chat };
