import { ReceivedUserDataOnClient } from "@/util/types";
import { fetcher } from "@/util/functions";
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

function useSearch(searchQuery: string, role: string, page: number) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/allUsers/search?searchQuery=${searchQuery}&page=${page}`,
    fetcher
  );

  return {
    users: data as ReceivedUserDataOnClient[],
    isLoading,
    error: error,
    mutate,
  };
}

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
          <InputLeftElement pointerEvents="none">
            <Search2Icon />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search"
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
