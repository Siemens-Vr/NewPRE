"use client";

import { MdSearch } from 'react-icons/md';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Search = ({ placeholder }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [filterType, setFilterType] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const currentQuery = searchParams.get('q') || '';
    setSearchValue(currentQuery);
    const currentFilter = searchParams.get('filter') || 'all';
    setFilterType(currentFilter);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);

    const params = new URLSearchParams(searchParams);
    params.set("page", 0);

    if (newValue) {
      params.set("q", newValue);
    } else {
      params.delete("q");
    }

    params.set("filter", filterType);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilterType(newFilter);

    const params = new URLSearchParams(searchParams);
    params.set("filter", newFilter);
    params.set("page", 0);
    if (searchValue) {
      params.set("q", searchValue);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
      <div className="flex items-center gap-3 rounded-lg shadow-sm">
        <select
            value={filterType}
            onChange={handleFilterChange}
            className="bg-[#c6e7e7] p-2 rounded-md h-[45px] text-sm text-gray-800 outline-none"
        >
          <option value="all">Search Filter</option>
          <option value="itemName">Item Name</option>
          <option value="PvNo">PV No</option>
          <option value="suppliers">Supplier</option>
          <option value="type">Type</option>
        </select>

        <div className="flex items-center bg-[#c6e7e7] p-2 h-[45px] rounded-md gap-2">
          <input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="bg-transparent outline-none text-sm text-gray-800"
          />
          <MdSearch className="text-gray-700" />
        </div>
      </div>
  );
};

export default Search;
