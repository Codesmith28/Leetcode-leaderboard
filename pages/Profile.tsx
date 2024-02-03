import NotifToast from "@/components/NotifToast/NotifToast";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import Layout from "./Layout";
import styles from "/styles/Profile.module.css";

async function deleteUser(toast: any) {
  const res = await fetch("/api/deleteUser", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  console.log("data", data);
  console.log("res", res);
  if (res.status !== 200) {
    console.log("error");
    NotifToast({
      title: "Error",
      description: data.message,
      status: "error",
      toast: toast,
    });
  } else {
    NotifToast({
      title: "Success",
      description: "Successfully deleted user",
      status: "success",
      toast: toast,
    });
    signOut({
      callbackUrl: "/",
    });
  }
}

function DeleteUserModal({
  isOpen,
  onOpen,
  onClose,
  toast,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toast: any;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Account</ModalHeader>
        <ModalBody className={styles.modalForm}>
          <div>Are you sure you want to delete your account?</div>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={isLoading}
            colorScheme="red"
            onClick={async () => {
              setIsLoading(true);
              await deleteUser(toast);
              setIsLoading(false);
              onClose();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function Profile() {
  const {
    isOpen: isDeleteUserModalOpen,
    onOpen: onDeleteUserModalOpen,
    onClose: onDeleteUserModalClose,
  } = useDisclosure();

  const toast = useToast();

  return (
    <Layout>
      <div className={styles.whole}>

        <ProfileCard toast = {toast}/>

        <Button variant={"delete"} onClick={onDeleteUserModalOpen}>
          Delete Account
        </Button>

        <DeleteUserModal
          isOpen={isDeleteUserModalOpen}
          onOpen={onDeleteUserModalOpen}
          onClose={onDeleteUserModalClose}
          toast={toast}
        />
      </div>
    </Layout>
  );
}

export default Profile;
