import { ArrowRightIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	List,
	ListIcon,
	ListItem,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import MotionDiv from "../MotionDiv/MotionDiv";
import styles from "./Groups.module.css";

async function joinTeam(teamId: ObjectId) {
	const res = await fetch("/api/teamJoined", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ teamId }),
	});

	if (res.status === 200) {
		alert("Team Joined Successfully");
	} else {
		alert("Something went wrong");
	}
}

export default function Groups({
	name,
	_id,
	institution,
	totalMembers,
	disabled,
	transition,
}: {
	institution: string | null;
	_id: ObjectId;
	name: string;
	totalMembers: number;
	disabled: boolean;
	transition: any;
}) {
	let colMain: string = institution === "none" ? "green" : "orange";
	let off = disabled && institution !== "none";

	if (off) {
		colMain = "gray";
	}

	const itemVariants = {
		hidden: { opacity: 0, x: -50 },
		visible: { opacity: 1, x: 0 },
	};

	return (
		<MotionDiv
			className={styles.cen}
			variants={itemVariants}
			initial="hidden"
			animate="visible"
			transition={transition}
		>
			<Box
				maxW={"300px"}
				w={"full"}
				bg={useColorModeValue("white", "gray.800")}
				boxShadow={"2xl"}
				rounded={"md"}
				overflow={"hidden"}
			>
				<Stack
					textAlign={"center"}
					p={6}
					color={useColorModeValue("gray.800", "white")}
					align={"center"}
				>
					<Text
						fontSize={"sm"}
						fontWeight={500}
						bg={useColorModeValue(
							`${colMain}.50`,
							`${colMain}.900`
						)}
						p={2}
						px={3}
						color={`${colMain}.500`}
						rounded={"full"}
					>
						{institution === "none" ? "Open" : "Institute"}
					</Text>
					<Stack
						direction={"row"}
						align={"center"}
						justify={"center"}
					>
						<Text
							fontSize={"4xl"}
							fontWeight={800}
							letterSpacing={-2}
						>
							{name}
						</Text>
					</Stack>
				</Stack>

				<Box
					bg={useColorModeValue("gray.50", "gray.900")}
					px={6}
					py={10}
				>
					<List spacing={3}>
						<ListItem>
							<ListIcon
								as={ArrowRightIcon}
								color={`${colMain}.400`}
								mb={"0.1rem"}
							/>
							Total Members: {totalMembers}
						</ListItem>
					</List>

					<Button
						className={off ? "" : "clicky"}
						mt={10}
						w={"full"}
						bg={`${colMain}.400`}
						color={"white"}
						rounded={"xl"}
						boxShadow={`0 5px 20px 0px ${colMain} `}
						_hover={{
							bg: `${colMain}.500`,
						}}
						_focus={{
							bg: `${colMain}.500`,
						}}
						isDisabled={off}
						onClick={async () => {
							await joinTeam(_id);
							window.location.href = "/Member/MyTeams";
						}}
					>
						Join!
					</Button>
				</Box>
			</Box>
		</MotionDiv>
	);
}
