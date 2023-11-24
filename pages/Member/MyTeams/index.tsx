import Layout from "@/pages/Layout";
import MyGroups from "@/pages/components/MyGroups/MyGroups";
import { TeamCol } from "@/util/types";
import { useEffect, useState } from "react";
import styles from "./MyTeams.module.css";

function GroupList({ teamData }: { teamData: any }) {
  return (
    <div className={styles.groups}>
      {teamData.map((group: any, index: number) => (
        <MyGroups
          key={index}
          _id={group._id}
          institution={group.institution}
          name={group.name}
          totalMembers={group.totalMembers}
          disabled={false}
        />
      ))}
    </div>
  );
}

function index() {
  // get all teams of the user

  // usestate for all teams:
  const [teams, setTeams] = useState<Object[]>([]);

  useEffect(() => {
    const getTeams = async () => {
      const res = await fetch("/api/getUserTeams", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setTeams(data);
    };
    getTeams();
  }, []);

  return (
    <>
      <Layout>
        <div>
          <GroupList teamData={teams} />
        </div>
      </Layout>
    </>
  );
}

export default index;