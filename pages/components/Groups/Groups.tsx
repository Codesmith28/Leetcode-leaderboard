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
  const colMain: string = type === "Open" ? "green" : "orange";

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
            bg={useColorModeValue(`${colMain}.50`, `${colMain}.900`)}
            p={2}
            px={3}
            color={`${colMain}.500`}
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
                color={`${colMain}.400`}
                mb={"0.1rem"}
              />
              Total Members: 10
            </ListItem>
          </List>

          <Button
            mt={10}
            w={"full"}
            bg={`${colMain}.400`}
            color={"white"}
            rounded={"xl"}
            boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
            _hover={{
              bg: `${colMain}.500`,
            }}
            _focus={{
              bg: `${colMain}.500`,
            }}
          >
            Join!
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
