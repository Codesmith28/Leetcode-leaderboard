import { TeamData } from "@/util/types";
import Groups from "../Groups";
import styles from "./GroupList.module.css";

export default function GroupList({
	teamData,
	myInsti,
}: {
	teamData: TeamData[];
	myInsti: string;
}) {
	const transition = {
		duration: 0.3,
		ease: "easeInOut",
	};

	return (
		<div className={styles.groups}>
			{teamData.map((group, index: number) => (
				<Groups
					key={index}
					_id={group._id}
					institution={group.institution}
					name={group.name}
					totalMembers={group.totalMembers}
					disabled={myInsti !== group.institution}
					transition={{ ...transition, delay: index * 0.09 }}
				/>
			))}
		</div>
	);
}
