import { ReceivedTeamDataOnClient } from "@/util/types";
import { Search2Icon } from "@chakra-ui/icons";
import {
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function SearchBar({ searchQuery, setSearchQuery, setPage }: SearchBarProps) {
  return (
    <div className={styles.searchBar}>
      <FormControl id="search">
        <InputGroup>
          <InputLeftElement pointerEvents="none"></InputLeftElement>
          <Input
            type="search"
            placeholder="Search Teams"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </InputGroup>
      </FormControl>
    </div>
  );
}

export default SearchBar;
