import { ReceivedTeamDataOnClient } from "@/util/types";
import Groups from "../Groups";
import styles from "./GroupList.module.css";

export default function GroupList({
  teamData,
  myInsti,
  mutate,
  isLoading,
  error,
  isAdmin,
}: {
  teamData: ReceivedTeamDataOnClient[];
  myInsti: string;
  mutate: () => void;
  isLoading: boolean;
  error: any;
  isAdmin: boolean;
}) {
  const transition = {
    duration: 0.3,
    ease: "easeInOut",
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.groups}>
      {teamData?.map((team, index: number) => (
        <Groups
          key={index}
          teamData={team}
          mutate={mutate}
          disabled={myInsti !== team.institution}
          transition={{ ...transition, delay: index * 0.09 }}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
