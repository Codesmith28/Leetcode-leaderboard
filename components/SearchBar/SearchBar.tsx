import { Search2Icon } from "@chakra-ui/icons";
import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
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
      <FormControl
        id="search"
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="md"
        boxShadow="md"
      >
        <InputGroup>
          <InputRightElement pointerEvents="none">
            <Search2Icon color="gray.300" />
          </InputRightElement>
          <Input
            type="search"
            placeholder="Search Teams"
            value={searchQuery}
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
