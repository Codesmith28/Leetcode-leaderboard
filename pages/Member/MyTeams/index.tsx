import GroupList from "@/components/GroupList/GroupList";
import MyGroups from "@/components/MyGroups/MyGroups";
import Layout from "@/pages/Layout";
import { ReceivedTeamDataOnClient, TeamCol, TeamData } from "@/util/types";
import { useEffect, useState } from "react";
import useSWR from "swr";
import styles from "./MyTeams.module.css";

import Pagination from "@/components/Pagination/Pagination";
import SearchBar from "@/components/SearchBar/SearchBar";

// function GroupList({ teamData }: { teamData: TeamData[] }) {
//   const transition = {
//     duration: 0.3,
//     ease: "easeInOut",
//   };

//   return (
//     <div className={styles.groups}>
//       {teamData.map((group: any, index: number) => (
//         <MyGroups
//           key={index}
//           _id={group._id}
//           institution={group.institution}
//           name={group.name}
//           totalMembers={group.totalMembers}
//           disabled={false}
//           transition={{ ...transition, delay: index * 0.09 }}
//         />
//       ))}
//     </div>
//   );
// }

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

  console.log(data);
  return {
    teams: data as ReceivedTeamDataOnClient[],
    isLoading,
    error,
    mutate,
  };
}

function index() {
  // get all teams of the user

  // usestate for all teams:
  // const [teams, setTeams] = useState<TeamData[]>([]);

  // useEffect(() => {
  //   const getTeams = async () => {
  //     const res = await fetch("/api/getUserTeams", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await res.json();

  //     setTeams(data);
  //   };
  //   getTeams();
  // }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const { teams, isLoading, error, mutate } = useSearch(searchQuery, page);

  console.log("my teams", teams);

  return (
    <>
      <Layout>
        <div>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
          />

          <GroupList
            teamData={teams}
            myInsti={"SEAS"}
            mutate={mutate}
            isLoading={isLoading}
            error={error}
          />

          <Pagination page={page} setPage={setPage} items={teams} />
        </div>
      </Layout>
    </>
  );
}

export default index;
