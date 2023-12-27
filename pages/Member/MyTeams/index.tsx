import GroupList from "@/components/GroupList/GroupList";
import Layout from "@/pages/Layout";
import { ReceivedTeamDataOnClient } from "@/util/types";
import { useEffect, useState } from "react";
import useSWR from "swr";
import styles from "./MyTeams.module.css";

import Pagination from "@/components/Pagination/Pagination";
import SearchBar from "@/components/SearchBar/SearchBar";
import { Center } from "@chakra-ui/react";

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
