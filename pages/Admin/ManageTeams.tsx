import FloatingButton from "@/components/FloatingButton";
import GroupList from "@/components/GroupList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBar from "@/components/SearchBar/SearchBar";
import { ReceivedTeamDataOnClient } from "@/util/types";
import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import { userInfo } from "os";
import React, { useState } from "react";
import useSWR from "swr";
import Layout from "../Layout";
import styles from "./ManageTeams.module.css";

async function fetcher(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

function useSearch(searchQuery: string, page: number) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/teamSearch/?searchQuery=${searchQuery}&page=${page}`,
    fetcher
  );

  return {
    teams: data as ReceivedTeamDataOnClient[],
    isLoading,
    error,
    mutate,
  };
}

function AddTeamModal({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInstitutional, setIsInstitutional] = useState(false);
  const [teamName, setTeamName] = useState("");

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Team</ModalHeader>

        <ModalBody className={styles.modalForm}>
          <div>
            <FormControl id="lc-username" isRequired>
              <FormLabel>Team Name</FormLabel>
              <Input
                placeholder=" "
                onChange={(e) => {
                  setTeamName(e.target.value);
                }}
              />
            </FormControl>
          </div>
          <div>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Is this an institutional team?</FormLabel>
              <Switch id="email-alerts" />
            </FormControl>
          </div>
        </ModalBody>

        {/* submit leetcode username: */}
        <ModalFooter>
          <Button
            isLoading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              // await submitLCUsername(username, institution);
              setIsLoading(false);
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

function CreateTeams() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { teams, isLoading, error, mutate } = useSearch(searchQuery, page);

  // useDisclosure for the modal:
  const {
    isOpen: isAddTeamModalOpen,
    onOpen: onAddTeamModalOpen,
    onClose: onAddTeamModalClose,
  } = useDisclosure();

  return (
    <Layout>
      <FloatingButton
        onOpen={onAddTeamModalOpen}
        SideIcon={AddIcon}
        HalfText="Add"
        RemainingText="Team"
        initialWidth={5.5}
        finalWidth={8}
        rotateBy={90}
      />

      <AddTeamModal
        isOpen={isAddTeamModalOpen}
        onOpen={onAddTeamModalOpen}
        onClose={onAddTeamModalClose}
      />

      <div>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        {isLoading ? (
          <Center>Loading...</Center>
        ) : (
          teams && (
            <GroupList
              teamData={teams}
              myInsti="none"
              mutate={mutate}
              isLoading={isLoading}
              error={error}
              isAdmin={true}
            />
          )
        )}

        <Pagination page={page} setPage={setPage} items={teams} />
      </div>
    </Layout>
  );
}

export default CreateTeams;
