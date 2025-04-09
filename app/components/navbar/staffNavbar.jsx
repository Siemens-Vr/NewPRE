"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "@/app/styles/navbar/navbar.module.css";
import { MdNotifications } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { config} from "@/config";

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid"); 
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!uuid) return; 

      setLoading(true);
      try {
        const response = await fetch(`${config.baseURL}/staffs/${uuid}`);
        if (!response.ok) throw new Error("Failed to fetch staff data");
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [uuid]);

  return (
    <div className={styles.container1}>
   
      <div className={styles.welcome}>
        {loading ? (
          <h3>Loading...</h3>
        ) : staff ? (
          <h3>Welcome, {staff.fullName}!</h3>
        ) : (
          <h3>Welcome!</h3>
        )}
      </div>

    
      <div className={styles.menu1}>
        <MdNotifications size={22} className={styles.notificationIcon} />

       
        <div className={styles.userMenu}>
          <div className={styles.user} onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars size={20} className={styles.menuIcon} />
          </div>

        
          {menuOpen && (
            <div className={styles.dropdownMenu}>
              <ul>
                <li onClick={() => console.log("Edit Profile Clicked")}>Edit Profile</li>
                <li onClick={() => console.log("Reset Password Clicked")}>Reset Password</li>
                <li onClick={() => console.log("Logout Clicked")}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
