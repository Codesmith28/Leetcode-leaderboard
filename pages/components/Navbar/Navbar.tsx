import { AddIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./Navbar.module.css";

interface Props {
  children: React.ReactNode;
}

const Links = ["MyTeams"];

const NavLink = (props: Props) => {
  const { children } = props;
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
    >
      {children}
    </Box>
  );
};

// modal that asks for Leetcode username if not provided
function UsrnModal({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1>Custom backdrop filters!</h1>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const {
    isOpen: isLCOpen,
    onOpen: onLCOpen,
    onClose: onLCClose,
  } = useDisclosure();

  let authBtn;

  // if a user exist:
  if (session && session.user) {
    // if it is an admin:
    if (session.user.role === "Admin") {
    }

    if (session.user.LCUserName === null) {
      // redirect to noUserName page
    }

    // if it is a user:
    authBtn = (
      <div className={styles.navMenu}>
        <Menu>
          <MenuButton>
            <Avatar className={styles.avatarButton} src={session.user.image!} />
          </MenuButton>
          <MenuList className={styles.menuList} minWidth="100x">
            <Link href={"./Profile"}>
              <MenuItem className={styles.menuItem}>My Profile</MenuItem>
            </Link>
            <MenuItem
              className={styles.menuOut}
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    );
  } else {
    // if no user exist:
    authBtn = (
      <Button
        isLoading={loading}
        onClick={async () => {
          setLoading(true);
          await signIn("google");
        }}
      >
        {loading ? "Signin In..." : "Sign in"}
      </Button>
    );
  }

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        borderRadius="lg"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
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

          <Link href={"/"} className={styles.title}>
            LeetCode LeaderBoard
          </Link>

          {/* button to open modal */}
          <Button onClick={onOpen}>Open Modal</Button>

          <Flex alignItems={"center"}>{authBtn}</Flex>
        </Flex>

        <UsrnModal isOpen={isLCOpen} onOpen={onLCOpen} onClose={onLCClose} />

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack
              bg={"gray.50"}
              className={styles.navBtn}
              as={"nav"}
              spacing={4}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={3}></Box>
    </>
  );
}
