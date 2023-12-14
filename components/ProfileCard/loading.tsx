import {
  Box,
  Center,
  Heading,
  Skeleton,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import styles from "./ProfileCard.module.css";
function Loading() {
  return (
    <>
      <Center>
        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          rounded={"lg"}
          textAlign={"center"}
          p={6}
        >
          <Center>
            <SkeletonCircle size={"100"} mt={-30} mb={4} pos={"relative"} />
          </Center>

          <Heading fontSize={"2xl"} fontFamily={"body"}></Heading>
          <div className={styles.stack}>
            <Skeleton height={"20px"} width={"60%"} />
            <Skeleton height={"15px"} width={"30%"} />
            <Skeleton height={"15px"} width={"40%"} />
          </div>

          <div className={styles.skellyCard}>
            <div className={styles.skellyLabel}>
              <div>
                <Heading fontSize={"lg"}>Email: </Heading>
              </div>
              <div>
                <Skeleton height={"15px"} width={"120%"} />
              </div>
            </div>

            <div className={styles.skellyLabel}>
              <div>
                <Heading fontSize={"lg"}>Institution: </Heading>
              </div>
              <div>
                <Skeleton height={"15px"} width={"120%"} />
              </div>
            </div>

            <div className={styles.skellyLabel}>
              <div>
                <Heading fontSize={"lg"}>Total solved: </Heading>
              </div>
              <div>
                <Skeleton height={"15px"} width={"120%"} />
              </div>
            </div>

            <div className={styles.skellyLabel}>
              <div>
                <Heading fontSize={"lg"}>Easy Solved: </Heading>
              </div>
              <div>
                <Skeleton height={"15px"} width={"120%"} />
              </div>
            </div>

            <div className={styles.skellyLabel}>
              <div>
                <Heading fontSize={"lg"}>Medium Solvedum: </Heading>
              </div>
              <div>
                <Skeleton height={"15px"} width={"120%"} />
              </div>
            </div>

            <div className={styles.skellyLabel}>
              <div>
                <Heading fontSize={"lg"}>Hard Solved: </Heading>
              </div>
              <div>
                <Skeleton height={"15px"} width={"120%"} />
              </div>
            </div>
          </div>
        </Box>
      </Center>
    </>
  );
}

export default Loading;
