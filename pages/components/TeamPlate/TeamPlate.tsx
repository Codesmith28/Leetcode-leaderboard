import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import React from "react";
import styles from "./TeamPlate.module.css";

function TeamPlate({ teamId }: { teamId: string } ) {
  let mem = 10;

  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        className={styles.mainCard}
      >
        <div className={styles.plateHead}>
          <Heading size={"lg"}>Team Name</Heading>

          <Heading size={"md"} color={"gray"}>
            Institution
          </Heading>
        </div>

        <div>
          {/* total members */}
          <Heading size={"sm"}>Total Members : {mem}</Heading>
          <div className={styles.topThree}>
            <Heading size={"sm"} color={"gold"} textDecor={"underline"}>
              #1
            </Heading>
            <Heading size={"sm"} color={"silver"} textDecor={"underline"}>
              #2
            </Heading>
            <Heading size={"sm"} color={"brown"} textDecor={"underline"}>
              #3
            </Heading>
          </div>
        </div>
      </Card>
    </>
  );
}
export default TeamPlate;
