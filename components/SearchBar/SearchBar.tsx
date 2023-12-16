import { Search2Icon } from "@chakra-ui/icons";
import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React from "react";
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
          <InputRightElement pointerEvents="none">
            <Search2Icon color="gray.300" />
          </InputRightElement>
          <Input
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
