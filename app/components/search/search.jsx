"use client"

import { MdSearch } from 'react-icons/md';
import styles from '@/app/styles/search/search.module.css';
import { usePathname, useSearchParams , useRouter} from 'next/navigation';

const Search = ({ placeholder }) => {

  const searchParams =  useSearchParams();
  const {replace} = useRouter();
  const pathname = usePathname();

 

  const handleSearch = (e) =>{
    const params = new URLSearchParams(searchParams);

    params.set("page", 0);
    
    if(e.target.value){

    params.set("q", e.target.value);
    }else{
      params.delete("q")
    }
    replace(`${pathname}?${params}`);

  }

  return (
    <div className={styles.container}>
      <MdSearch />
      <input
        type="text"
        placeholder={placeholder}
        // value={value}
        onChange={handleSearch}
        className={styles.input}
      />
    </div>
  );
};

export default Search;
