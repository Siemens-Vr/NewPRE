"use client"

import { MdSearch } from 'react-icons/md';
import styles from '@/app/styles/search/searchfilter.module.css';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const Search = ({ placeholder }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [filterType, setFilterType] = useState('all');

  const handleSearch = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", 0);
    
    if (e.target.value) {
      params.set("q", e.target.value);
    } else {
      params.delete("q");
    }
    params.set("filter", filterType);
    replace(`${pathname}?${params}`);
  }

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    const params = new URLSearchParams(searchParams);
    params.set("filter", e.target.value);
    params.set("page", 0);
    replace(`${pathname}?${params}`);
  }

  return (
    <div className={styles.container}>
      <select
        value={filterType}
        onChange={handleFilterChange}
        className={styles.select}
      >
        <option value="all">Search Filter</option>
        <option value="destination">Destination</option>
        <option value="travelPeriod">Travel Period</option>
        <option value="travellers">Travellers</option>
        <option value="type">Type</option>
      

      </select>
      <MdSearch />
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleSearch}
        className={styles.input}
      />
    </div>
  );
};

export default Search;