import FloatingButton from "@/components/FloatingButton";
import GroupList from "@/components/GroupList";
import NotifToast from "@/components/NotifToast/NotifToast";
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
  useToast,
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

async function createNewTeam(
  teamName: string,
  isInstitutional: boolean,
  mutate: Function,
  toast: any
) {
  if (!teamName) {
    NotifToast({
      title: "Please enter a team name",
      status: "warning",
      toast: toast,
    });
    return;
  }

  const res = await fetch("/api/createNewTeam", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamName, isInstitutional }),
  });

  if (res.status === 200) {
    NotifToast({
      title: "Team created successfully",
      status: "success",
      toast: toast,
    });
    mutate();
  } else {
    NotifToast({
      title: "Team creation failed",
      status: "error",
      toast: toast,
    });
  }
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
  mutate,
  toast,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  mutate: Function;
  toast: any;
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
                placeholder="Enter team name"
                onChange={(e) => {
                  setTeamName(e.target.value);
                }}
              />
            </FormControl>
          </div>
          <div>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <FormLabel mb="0">Is this an institutional team?</FormLabel>
              <Switch
                isChecked={isInstitutional}
                onChange={(e) => {
                  setIsInstitutional(e.target.checked);
                }}
              />
            </FormControl>
          </div>
        </ModalBody>

        {/* submit leetcode username: */}
        <ModalFooter>
          <Button
            isLoading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await createNewTeam(teamName, isInstitutional, mutate, toast);
              setIsLoading(false);
              onClose();
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ManageTeams() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { teams, isLoading, error, mutate } = useSearch(searchQuery, page);

  // useDisclosure for the modal:
  const {
    isOpen: isAddTeamModalOpen,
    onOpen: onAddTeamModalOpen,
    onClose: onAddTeamModalClose,
  } = useDisclosure();

  const toast = useToast();

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
        mutate={mutate}
        toast={toast}
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

export default ManageTeams;
