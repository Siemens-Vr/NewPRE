"use client"

import { MdSearch } from 'react-icons/md';
import styles from '@/app/styles/search/search.module.css'



const Search = ({value, onChange, placeholder }) => {

  

  return (
    <div className={styles.container}>
      <MdSearch />
      <input
      type="text"
      className={styles.input}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    </div>
  );
};

export default Search;



