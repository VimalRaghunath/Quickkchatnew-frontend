import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../Components/Authentication/Context/ChatProvider'

const ChatBox = () => {

  const { selectedChat } = ChatState()

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      bg={"white"}
      w={{ base: "90%", md: "59%", xl: "69%", sm: "90%" }}
      h={"88vh"}
      borderRadius={"1g"}
      borderWidth={"1px"}
       mt={{base:"32.5rem",  md: "32.5rem", xl:"32.5rem",sm:"32.5rem"}}
    >

      Single Chat
    </Box>
  )
}

export default ChatBox
