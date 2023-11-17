import React from "react";
import styles from "./SearchBar.module.css";
import { FormControl, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

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
