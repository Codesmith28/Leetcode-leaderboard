import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import Layout from "../Layout";

function index() {
  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: "20px",
        }}
      >
        <Link href="/Admin/ManageTeams">
          <Button>Manage Teams</Button>
        </Link>
        <Link href="/Admin/ManageUsers">
          <Button>Manage Users</Button>
        </Link>
      </div>
    </Layout>
  );
}

export default index;
