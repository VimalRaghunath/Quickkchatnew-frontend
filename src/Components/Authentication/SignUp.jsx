import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Show, VStack } from '@chakra-ui/react'

const SignUp = () => {

    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [confirmPassword,setConfirmPassword] = useState();
    const [Show,setShow] = useState(false);


    const handleClick = () => setShow(!Show);

    const postDetails = (pics) => {

    };

    const submitHandler = () => {

    };

  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl id="first-name" isRequired>
        <FormLabel>
          Name
        </FormLabel>
        <Input
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>
            Email
        </FormLabel>
        <Input
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>
            Password
        </FormLabel>
        <InputGroup>

          <Input
            type={Show ? "text" : "password" }
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        <InputRightElement width={"4.5rem"}>
          <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
            { Show ? "Hide" : "Show" }
          </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm password" isRequired>
        <FormLabel>
            Confirm Password
        </FormLabel>
        <InputGroup>
          <Input
            type={Show ? "text" : "password" }
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.7rem"} size={"sm"} onClick={handleClick}>
             { Show ? "Hide" : "Show" }
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
         <FormLabel>
           Upload your Picture
         </FormLabel>
         <Input
           type="file"
           p={1.5}
           accept="image/*"
           onChange={(e) => postDetails(e.target.files[0])}
         />
         <Button
           colorScheme="blue"
           width={"100%"}
           style={{ marginTop:15 }}
           onClick={submitHandler}
         >
            Sign Up
         </Button>
      </FormControl>
    </VStack>
  )
}

export default SignUp
