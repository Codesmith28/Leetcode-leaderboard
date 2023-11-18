import styles from "@/styles/Home.module.css";
import { TeamCol } from "@/util/types";
import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";
import { StringDecoder } from "string_decoder";
import useSWR from "swr";
import Layout from "./Layout";
import Groups from "./components/Groups/Groups";
import Pagination from "./components/Pagination/Pagination";
import SearchBar from "./components/SearchBar/SearchBar";
import UserList from "./components/UserList/UserList";

// api call to get list of all teams:
// async function getAllTeams() {
//   const res = await fetch("/api/getTeams", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await res.json();
//   return data;
// }

// function to search all teams:
function teamSearch(searchQuery: string, page: number, id: string) {
  //   const { data, error, isLoading, mutate } = useSWR(
  //   `/api/house/${id}/searchMembers?searchQuery=${searchQuery}&page=${page}`,
  //   fetcher
  // );
  return {
    // users: data as TeamCol[],
    // isLoading,
    // error: error,
    // mutate,
  };
}

// component to list all teams:
function GroupList({ teamData, myInsti }: { teamData: any; myInsti: string }) {
  return (
    <div className={styles.groups}>
      {teamData.map((group: any, index: number) => (
        <Groups
          key={index}
          institution={group.institution}
          name={group.name}
          totalMembers={group.totalMembers}
          disabled={myInsti !== group.institution}
        />
      ))}
    </div>
  );
}

interface Info {
  username: string;
  email: string;
  institution: string;
  totalSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
}

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [teams, setTeams] = useState([]);
  const [userInfo, setUserInfo] = useState<Info>({
    username: "",
    email: "",
    institution: "",
    totalSolved: 0,
    totalEasy: 0,
    totalMedium: 0,
    totalHard: 0,
  });

  // const { teams, isLoading, error, mutate } = teamSearch(
  //   searchQuery,
  //   page,
  //   teamId as string
  // );

  useEffect(() => {
    const getAllTeams = async () => {
      const res = await fetch("/api/getTeams", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const teamData = await res.json();
      setTeams(teamData);
    };

    const getInfo = async () => {
      const res = await fetch("/api/getInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setUserInfo(data);
    };

    getAllTeams();
    getInfo();
  }, []);

  return (
    <>
      <Head>
        <title>LeetCode LeaderBoard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="color-scheme" content="dark " />
      </Head>
      <main className={styles.pg}>
        <Layout>
          <div>
            <SearchBar
              searchQuery={searchText}
              setSearchQuery={setSearchText}
              setPage={setPage}
            />
            <GroupList teamData={teams} myInsti={userInfo.institution} />
            {/* <Pagination page={page} setPage={setPage} items={teams} /> */}
          </div>
        </Layout>
      </main>
    </>
  );
}
