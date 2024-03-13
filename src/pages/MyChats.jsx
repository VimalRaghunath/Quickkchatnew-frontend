import React, { useEffect, useState } from 'react'
import { ChatState } from '../Components/Authentication/Context/ChatProvider'
import { Box, useToast } from '@chakra-ui/react';
import { AxiosInstance } from '../AxiosInstance/AxiosInstance';

const MyChats = () => {

  const [loggedUser, setLoggedUser] = useState();
  const {user, setUser, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await AxiosInstance.get("/api/chat", config);
      setChats(data)
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      });
    }
  }

  useEffect(()=>{
     setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
     fetchChats();
    },[])

  return (
   <Box
     display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
     flexDir={"column"}
     alignItems={"center"}
     p={3}
     bg={"white"}
     w={{ base: "100%", md: "31%" }}
     borderRadius={"1g"}
     borderWidth={"1px"}
   >
    
   </Box>
  )
}

export default MyChats
