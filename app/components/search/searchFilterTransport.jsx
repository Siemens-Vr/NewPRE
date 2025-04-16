// "use client"
//
// import { MdSearch } from 'react-icons/md';
// import styles from '@/app/styles/search/searchfilter.module.css';
// import { usePathname, useSearchParams, useRouter } from 'next/navigation';
// import { useState } from 'react';
//
// const Search = ({ placeholder }) => {
//   const searchParams = useSearchParams();
//   const { replace } = useRouter();
//   const pathname = usePathname();
//   const [filterType, setFilterType] = useState('all');
//
//   const handleSearch = (e) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", 0);
//
//     if (e.target.value) {
//       params.set("q", e.target.value);
//     } else {
//       params.delete("q");
//     }
//     params.set("filter", filterType);
//     replace(`${pathname}?${params}`);
//   }
//
//   const handleFilterChange = (e) => {
//     setFilterType(e.target.value);
//     const params = new URLSearchParams(searchParams);
//     params.set("filter", e.target.value);
//     params.set("page", 0);
//     replace(`${pathname}?${params}`);
//   }
//
//   return (
//     <div className={styles.container}>
//       <div  className={styles.selects}>
//       <select
//         value={filterType}
//         onChange={handleFilterChange}
//         className={styles.select}
//       >
//         <option value="all">Search Filter</option>
//         <option value="destination">Destination</option>
//         <option value="travelPeriod">Travel Period</option>
//         <option value="travellers">Travellers</option>
//         <option value="type">Type</option>
//
//
//       </select>
//       </div>
//       <div  className={styles.search}  >
//       <input
//         type="text"
//         placeholder={placeholder}
//         onChange={handleSearch}
//         className={styles.input}
//       />
//       <MdSearch />
//       </div>
//     </div>
//   );
// };
//
// export default Search;

"use client";

import { MdSearch } from 'react-icons/md';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const Search = ({ placeholder }) => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const [filterType, setFilterType] = useState(searchParams.get("filter") || "all");
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const params = new URLSearchParams(searchParams);
        params.set("page", 0);

        if (value) {
            params.set("q", value);
        } else {
            params.delete("q");
        }

        params.set("filter", filterType);
        replace(`${pathname}?${params.toString()}`);
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilterType(value);

        const params = new URLSearchParams(searchParams);
        params.set("filter", value);
        params.set("page", 0);
        if (searchTerm) {
            params.set("q", searchTerm);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-3  rounded-lg shadow-sm">
            <select
                value={filterType}
                onChange={handleFilterChange}
                className="bg-[#c6e7e7] p-2 rounded-md h-[45px] text-sm"
            >
                <option value="all">All</option>
                <option value="destination">Destination</option>
                <option value="travelPeriod">Travel Period</option>
                <option value="travellers">Travellers</option>
                <option value="type">Type</option>
            </select>

            <div className="flex items-center bg-[#c6e7e7] p-2 h-[45px] rounded-md gap-2">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="bg-transparent outline-none text-sm"
                />
                <MdSearch className="text-gray-700" />
            </div>
        </div>
    );
};

export default Search;
