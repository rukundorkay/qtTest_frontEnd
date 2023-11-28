"use client";

// import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  // IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  // Stack,
  useColorModeValue,
  // useDisclosure,
  Text,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Links = ["Dashboard", "Projects", "Team"];

const NavLink = () => {
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    ></Box>
  );
};

export default function NavBar() {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const user =  JSON.parse(Cookies.get("user")) 
  const navigate = useNavigate()


  const handleLogout = ()=>{
    Cookies.remove('user');
    Cookies.remove('token');
    navigate('/')
  }

  return (
    <>
      <Box bg={useColorModeValue("gray.900", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {/* <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          /> */}
          <HStack spacing={8} alignItems={"center"}>
            <Text color={"white"}> Task Manager</Text>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
                
              >
                <Flex gap={4} alignItems='center'>
                <Text color={'white'} textDecoration={'none'}>{user?.first_name}</Text>
                <Avatar
                  size={"sm"}
                  
                 
                />
                </Flex>
                
              </MenuButton>
              <MenuList>
                
                <MenuItem>Profile</MenuItem>
                <MenuDivider />
                <MenuItem color={'red.500'} onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {/* {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null} */}
      </Box>
    </>
  );
}
