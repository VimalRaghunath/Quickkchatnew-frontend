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


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();
// console.log(selectedChat);
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


  useEffect(()=>{
    fetchMessages()
  },[selectedChat])


  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
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
