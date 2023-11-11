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
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

interface Props {
  children: React.ReactNode;
}

const Links = ["MyTeams"];

// post request to upload leetcode username and institution name to database if not already there
async function submitLCUsername(username: string, institution: string) {
  const res = await fetch("/api/submitLCUsername", {
    method: "PUT",
    body: JSON.stringify({
      username: username,
      institution: institution,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
}

async function ft(onOpen: () => void) {
  const res = await fetch("/api/isFirstTime", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (res.status === 200) {
    if (data.isFirstTime) {
      onOpen();
    } else {
      console.log("Not first time");
    }
  }
}

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
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [username, setUsername] = useState("");
  const [institution, setInstitution] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Some Credentials missing!</ModalHeader>

        <ModalBody className={styles.modalForm}>
          <div>
            <FormControl variant="floating" id="lc-username" isRequired>
              <Input
                placeholder=" "
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <FormLabel>LeetCode Username</FormLabel>
            </FormControl>
          </div>
          <div>
            <FormControl variant="floating" id="institution-name">
              <Input
                placeholder=" "
                onChange={(e) => {
                  setInstitution(e.target.value);
                }}
              />
              <FormLabel>Institution Name</FormLabel>
            </FormControl>
          </div>
        </ModalBody>

        {/* submit leetcode username: */}
        <ModalFooter>
          <Button
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              await submitLCUsername(username, institution);
              setLoading(false);
              onClose();
            }}
          >
            Submit
          </Button>
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

  useEffect(() => {
    if (session && session.user) {
      ft(onLCOpen);
    }
  }, [session]);

  const updateInfo = async (
    easy: number,
    medium: number,
    hard: number,
    total: number
  ) => {
    try {
      const res = await fetch("/api/updateInfo", {
        method: "PUT",
        body: JSON.stringify({
          easy,
          medium,
          hard,
          total,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update information");
      }

      const data = await res.json();
      console.log("Information updated successfully:", data);
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };

  if (session && session.user) {
    if (session.user.role === "Admin") {
    }

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
    authBtn = (
      <Button
        isLoading={loading}
        onClick={async () => {
          setLoading(true);
          await signIn("google");
          setLoading(false);
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
        <UsrnModal isOpen={isLCOpen} onOpen={onLCOpen} onClose={onLCClose} />
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
            onClick={onLCOpen}
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
