import React, { useEffect, useState } from 'react'
import { ChatState } from '../Components/Authentication/Context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AxiosInstance } from '../AxiosInstance/AxiosInstance';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from './Config/ChatLogic';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {

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
    },[fetchAgain])
    

  return (
   <Box
     display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
     flexDir={"column"}
     alignItems={"center"}
     p={3}
     bg={"white"}
     w={{ base: "100%", md: "40%" ,xl:"30%",sm:"100%"}}
     h={"88vh"}
     borderRadius={"1g"}
     borderWidth={"1px"} 
     mt={{base:"32.5rem",  md: "32.5rem", xl:"32.5rem",sm:"32.5rem"}}
     
   >

     <Box
       pb={3}
       px={3}
       fontSize={{ base: "28px", md: "30px" }}
       fontFamily={"Work sans"}
       display={"flex"}
       width={"100%"}
       justifyContent={"space-between"}
       alignItems={"center"}
     > 
       My Chats
       <GroupChatModal>
       <Button 
         display={"flex"} 
         fontSize={{ base: "17px", md: "10px", lg:"17px" }} 
         rightIcon={<AddIcon/>}
         >
        New Group Chat
       </Button>
       </GroupChatModal>
     </Box>
    <Box
     display={"flex"}
     flexDir={"column"}
     p={3}
     bg={"#F8F8F8"}
     w={"100%"}
     h={"100%"}
     borderRadius={"1g"}
     overflowY={"hidden"}
    >
      {chats ? (
        <Stack overflowY={"scroll"}>
          {chats?.map((chat) => (
             <Box
              onClick={() => setSelectedChat(chat)}
              cursor={"pointer"}
              bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat === chat ? "white" :"black" }
              px={3}
              py={2}
              borderRadius={"1g"}
              key={chat._id}
             >
               <Text>
                {chat.isGroupChat === false
                  ? getSender(loggedUser, chat.Users) 
                  : chat.ChatName}
               </Text>
             </Box>
          ))}
        </Stack>
      ) : (
        <ChatLoading/>
      )}
    </Box>
   </Box>
  )
}

export default MyChats
