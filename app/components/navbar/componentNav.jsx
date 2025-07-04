"use client";
import React from 'react';

import { usePathname } from "next/navigation";
import styles from '@/app/styles/navbar/navbar.module.css';
import Image from "next/image";

// import styles from '@/app/styles/sidebar/sidebar.module.css';

import {
  MdNotifications,
  MdOutlineChat,
  MdPublic,
  MdSearch,
} from "react-icons/md";

const ComponentNavbar = () => {
  const pathname = usePathname();
  const user = {
    "username": "cheldean",
    "role" : "Admin"
  }

  if (!user) {
    console.error("User data is not available.");
    return <div className={styles.container}>User data not available</div>;
  }


  return (
    <div className={styles.container}>
      {/*<div className={styles.title}>{pathname.split("/").pop()}</div>*/}
      <div className={styles.menu}>

         {/* <div className={styles.search}>
          <input type="text" placeholder="Search..." className={styles.input} />
          <MdSearch />
        </div>  */}

        <div>
            <h2 className={styles.component}>Equipments</h2>
        </div>


        <div className={styles.icons}>
          <MdOutlineChat size={20}/>
          <MdNotifications size={20}/>
          {/*<MdPublic size={20}/>*/}
          <div className={styles.user}>
            <Image
                className={styles.userImage}
                src="/noavatar.png"
                alt=""
                width="50"
                height="50"
            />
            <div className={styles.userDetail}>
              <span className={styles.username}>{user ? user.username.toUpperCase() : "Jane"}</span>
              <span className={styles.userTitle}>{user ? user.role.toUpperCase() : "Admin"}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComponentNavbar;
