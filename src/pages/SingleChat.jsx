import React, { useEffect, useState } from "react";
import { ChatState } from "../Components/Authentication/Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./Config/ChatLogic";
import ProfileModal from "./ProfileModal";
import ReUpdateGroupChatName from "./ReUpdateGroupChatName";
import { AxiosInstance } from "../AxiosInstance/AxiosInstance";
import "./style.css"
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../Animations/typing.json";


const ENDPOINT = "https://quickkchat-latest-backend-dev-cjsx.1.us-1.fl0.io";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }
  

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();


  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await AxiosInstance.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data)
      setLoading(false)

      socket.emit("join chat", selectedChat._id)

    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected",() => setSocketConnected(true))
    socket.on("typing",() => setIsTyping(true))
    socket.on("stop typing",() => setIsTyping(false))
  },[])


  useEffect(()=>{
    fetchMessages();

    selectedChatCompare = selectedChat;
  },[selectedChat])



  useEffect(() => {
    socket.on("message received",(newMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id)
      {
        if (!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived])
      }
    });
  });


  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await AxiosInstance.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data)
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };



  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if(!socketConnected) return;

    if(!typing) {
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if(timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id)
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {messages && (!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.Users)}
                <ProfileModal user={getSenderFull(user, selectedChat.Users)} />
              </>
            ) : (
              <>
                {selectedChat.ChatName.toUpperCase()}
                <ReUpdateGroupChatName
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            ))}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"lightyellow"}
            w={"100%"}
            h={"100%"}
            borderRadius={"1g"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages}/>
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping? <div>
                <Lottie
                  options={defaultOptions}
                  width={"20"}
                  style={{ marginBottom: 10, marginLeft: 0 }}
                />
              </div> : <></>}
              <Input
                variant={"filled"}
                bg={"lightgrey"}
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
