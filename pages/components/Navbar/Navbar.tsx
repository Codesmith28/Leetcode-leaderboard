import { AddIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
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
import { useState } from "react";
import styles from "./Navbar.module.css";

interface Props {
  children: React.ReactNode;
}

const Links = ["MyTeams"];

// // post request to upload leetcode username and institution name to database if not already there
// function submitLeetcodeUsername() {
//   const username = document.getElementById("lc-username") as HTMLInputElement;
//   const institution = document.getElementById(
//     "institution-name"
//   ) as HTMLInputElement;
//   fetch("/api/submitLeetcodeUsername", {
//     method: "POST",
//     body: JSON.stringify({
//       username: username.value,
//       institution: institution.value,
//     }),
//   });
// }

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

// Modal that asks for Leetcode username if not provided
function UsrnModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Some Credentials missing!</ModalHeader>

        <ModalBody className={styles.modalForm}>
          <div>
            <FormControl variant="floating" id="lc-username" isRequired>
              <Input placeholder=" " />
              <FormLabel>LeetCode Username</FormLabel>
            </FormControl>
          </div>
          <div>
            <FormControl variant="floating" id="institution-name">
              <Input placeholder=" " />
              <FormLabel>Institution Name</FormLabel>
            </FormControl>
          </div>
        </ModalBody>

        {/* submit leetcode username: */}
        <ModalFooter>
          <Button>Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
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
      <UsrnModal isOpen={isOpen} onClose={onClose} />

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

          {/* button to trigger modal */}
          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            variant="solid"
            onClick={onOpen}
          />

          <Link href={"/"} className={styles.title}>
            LeetCode LeaderBoard
          </Link>

          <Flex alignItems={"center"}>{authBtn}</Flex>
        </Flex>

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
