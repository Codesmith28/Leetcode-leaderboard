import GroupList from "@/components/GroupList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBar from "@/components/SearchBar/SearchBar";
import { ReceivedTeamDataOnClient } from "@/util/types";
import { Center } from "@chakra-ui/react";
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

function CreateTeams() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { teams, isLoading, error, mutate } = useSearch(searchQuery, page);

  return (
    <Layout>
      <div>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        {teams &&
          (isLoading ? (
            <Center>Loading...</Center>
          ) : (
            <GroupList
              teamData={teams}
              myInsti="none"
              mutate={mutate}
              isLoading={isLoading}
              error={error}
              isAdmin={true}
            />
          ))}
        <Pagination page={page} setPage={setPage} items={teams} />
      </div>
    </Layout>
  );
}

export default CreateTeams;
