import { Box, Button, Text, Tooltip } from '@chakra-ui/react';
import React, { useState } from 'react'

function SideDrawer() {

  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  return (
    <div>
      <Box>
        <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end' >
          <Button variant={"ghost"}>
          <i class="fa-solid fa-magnifying-glass"></i>
          <Text display={{ base: "none", md: "flex" }}>
            Search User
          </Text>
          </Button>
        </Tooltip>
      </Box>
    </div>
  )
}

export default SideDrawer
