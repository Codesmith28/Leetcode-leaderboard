import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import styles from "./Groups.module.css";

export default function Groups({ type }: { type: string }) {
  return (
    <Center py={6}>
      <Box
        maxW={"300px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Stack
          textAlign={"center"}
          p={6}
          color={useColorModeValue("gray.800", "white")}
          align={"center"}
        >
          <Text
            fontSize={"sm"}
            fontWeight={500}
            bg={
              type === "Open"
                ? useColorModeValue("green.50", "green.900")
                : useColorModeValue("orange.50", "orange.900")
            }
            p={2}
            px={3}
            color={type === "Open" ? "green.500" : "orange.500"}
            rounded={"full"}
          >
            {type}
          </Text>
          <Stack direction={"row"} align={"center"} justify={"center"}>
            <Text fontSize={"4xl"} fontWeight={800} letterSpacing={-2}>
              Group A
            </Text>
          </Stack>
        </Stack>

        <Box bg={useColorModeValue("gray.50", "gray.900")} px={6} py={10}>
          <List spacing={3}>
            <ListItem>
              <ListIcon
                as={ArrowRightIcon}
                color={type === "Open" ? "green.400" : "orange.400"}
              />
              Total Members: 10
            </ListItem>
          </List>

          <Button
            mt={10}
            w={"full"}
            bg={type === "Open" ? "green.400" : "orange.400"}
            color={"white"}
            rounded={"xl"}
            boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
            _hover={{
              bg: type === "Open" ? "green.500" : "orange.500",
            }}
            _focus={{
              bg: type === "Open" ? "green.500" : "orange.500",
            }}
          >
            Join!
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
