import React from "react";
import { ChatState } from "../Components/Authentication/Context/ChatProvider";
import SideDrawer from "./SideDrawer";
import { Box } from "@chakra-ui/react";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

const ChatPage = () => {

  const { user } = ChatState() 

  return (
   <div style={{ width: "100%"}}>
     {user && <SideDrawer/>}
     <Box
       display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        height="15vh"
        padding="10px"
     >
      {user && <MyChats/>}
      {user && <ChatBox/>}
     </Box>
   </div>
  )
};

export default ChatPage;
