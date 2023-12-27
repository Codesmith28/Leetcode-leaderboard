import GroupList from "@/components/GroupList/GroupList";
import MyGroups from "@/components/MyGroups/MyGroups";
import Layout from "@/pages/Layout";
import { ReceivedTeamDataOnClient, TeamCol, TeamData } from "@/util/types";
import { useEffect, useState } from "react";
import useSWR from "swr";
import styles from "./MyTeams.module.css";

import FloatingButton from "@/components/FloatingButton/FloatingButton";
import Pagination from "@/components/Pagination/Pagination";
import loading from "@/components/ProfileCard/loading";
import SearchBar from "@/components/SearchBar/SearchBar";
import submitLCUsername from "@/pages/api/submitLCUsername";
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
  Select,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";

async function fetcher(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

function useSearch(searchQuery: string, page: number) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/myTeamSearch/?searchQuery=${searchQuery}&page=${page}`,
    fetcher
  );

  return {
    teams: data as ReceivedTeamDataOnClient[],
    isLoading,
    error,
    mutate,
  };
}

function index() {
  const [myInsti, setMyInsti] = useState("");
  useEffect(() => {
    const getMyInfo = async () => {
      const res = await fetch("/api/getInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setMyInsti(data.institution);
    };

    getMyInfo();
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const { teams, isLoading, error, mutate } = useSearch(searchQuery, page);

  return (
    <>
      <Layout>


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
                myInsti={myInsti}
                mutate={mutate}
                isLoading={isLoading}
                error={error}
                isAdmin={false}
              />
            )
          )}

          <Pagination page={page} setPage={setPage} items={teams} />
        </div>
      </Layout>
    </>
  );
}

export default index;
