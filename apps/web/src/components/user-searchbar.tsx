"use client";

import React, { useState } from "react";
import { Input, Button } from "payit-ui";
type UserSearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

export function UserSearchBar({
  onSearch,
  placeholder = "Search users...",
}: UserSearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full  max-w-md flex items-center gap-2 text-black"
    >
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-grow"
      />

      <Button type="submit" className="shrink-0">
        Search
      </Button>
    </form>
  );
}
