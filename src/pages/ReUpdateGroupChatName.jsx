import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../Components/Authentication/Context/ChatProvider';
import { ViewIcon } from '@chakra-ui/icons';
import UserBadgeItem from "./UserBadgeItem";
import { AxiosInstance } from "../AxiosInstance/AxiosInstance";
import UserListItem from './UserListItem';

const ReUpdateGroupChatName = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
        const [groupChatName, setGroupChatName] = useState()
        const [search, setSearch] = useState("");
        const [searchResult, setSearchResult] = useState([]);
        const [loading, setLoading] = useState(false);
        const [renameLoading, setRenameLoading] = useState(false);

        const toast = useToast()

        const { selectedChat, setSelectedChat, user } = ChatState();
        



         const handleAddUser = async (user1) => {
            if (selectedChat.Users.find((u) => u._id === user1._id)) {
              toast({
                title: "User Already in Group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
            }

            if (selectedChat.GroupAdmin._id !== user._id) {
              toast({
                title: "Only Admin can add someone",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
            }

            try {
               setLoading(true)

               const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`
                },
              }

              const { data } = await AxiosInstance.put("/api/chat/groupadd", {
                 chatId: selectedChat._id,
                 userId: user1._id,
              }, config)

              setSelectedChat(data)
              setFetchAgain(!fetchAgain)
              setLoading(false)
  
            } catch (error) {
              toast({
                title: "Error Occurred",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false)
            }
         }




        
         const handleRemove = async (user1) => {
          //  console.log("hi");
          if (selectedChat.GroupAdmin._id !== user._id && user1._id !== user._id) {
            // console.log("true");
            toast({
              title: "Only Admin can remove someone",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }

          try {
            setLoading(true);
          
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`
              },
            }
            const data = await AxiosInstance.put("/api/chat/groupremove", {
              chatId: selectedChat._id,
              userId: user1._id,
            }, config)

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data?.data);
            // setSelectedChat(data)
            setFetchAgain(!fetchAgain);
            fetchMessages()
            setLoading(false);

          } catch (error) {
            toast({
              title: "Error Occurred",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
          }
       }





        const handleRename = async () => {

          if(!groupChatName) return

          try {
            
            setRenameLoading(true)

            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`
              },
            }

            const { data } = await AxiosInstance.put("/api/chat/rename", {
                chatId: selectedChat._id,
                ChatName: groupChatName,
            }, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)

          } catch (error) {
            toast({
              title: "Error Occurred",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
             setRenameLoading(false);
          }

          setGroupChatName("")
         }




         const handleSearch = async (query) => {
          setSearch(query);
          if (!query) {
            return;
          }
      
          try {
            setLoading(true);
      
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
      
            const { data } = await AxiosInstance.get(
              `/api/user?search=${search}`,
              config
            );
            setLoading(false);
            setSearchResult(data);
          } catch (error) {
            toast({
              title: "Error Occured",
              description: "Failed to load the search Results",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
          }
        };




 
    return (
      <>
          <IconButton display={{ base: "flex" }} icon={<ViewIcon/>} onClick={onOpen} />
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize={"35px"}
                fontFamily={"Work sans"}
                display={"flex"}
                justifyContent={"center"}
              >
                {selectedChat.ChatName} 
               </ModalHeader>
              <ModalCloseButton />
                <ModalBody>
                  <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3} >
                    {selectedChat.Users.map((u) => (
                        <UserBadgeItem
                           key={u._id}
                           user={u}
                           handleFunction={() => handleRemove(u)}
                        />
                    ))}
  
                  </Box>
                    <FormControl display={"flex"} >
                       <Input
                         placeholder='Chat Name'
                         mb={3}
                         value={groupChatName}
                         onChange={(e) => setGroupChatName(e.target.value)}
                       />
                       <Button 
                          variant={"solid"}
                          colorScheme={"teal"}
                          ml={1}
                          isLoading={renameLoading}
                          onClick={handleRename}
                        >
                          Update
                       </Button>
                    </FormControl>
                     <FormControl display={"flex"} >
                        <Input
                          placeholder='Add users to Group'
                          mb={1}
                          onChange={(e) => handleSearch(e.target.value)}
                        />

                        </FormControl>

                        {loading ?  (
                          <Spinner size={"1g"} />
                        ) : (
                          searchResult?.map((user)=>(
                             <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                             />
                          ))
                        )}
                </ModalBody>
    
              <ModalFooter>
                <Button onClick={() => handleRemove(user)} colorScheme='red' >
                  Leave Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
  )
}

export default ReUpdateGroupChatName


