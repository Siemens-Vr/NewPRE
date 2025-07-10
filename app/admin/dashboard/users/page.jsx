"use client"
import api from '@/app/lib/utils/axios';
import styles from '@/app/styles/users/users.module.css';
import Search from '@/app/components/search/search';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'


const UsersPage =  () => {
const router = useRouter();
const [loading, setLoading] = useState(false);
const [q, setQ]             = useState('');
const [users, setUsers]     = useState([]);

// 2. on mount, read ?q= from the URL
useEffect(() => {
 const p = new URLSearchParams(window.location.search);
 setQ(p.get('q') || '');
}, []);

// 3. whenever q changes, push it into the URL and re-fetch
useEffect(() => {
 // update the URL
 const url = new URL(window.location.href);
 if (q)    url.searchParams.set('q', q);
 else      url.searchParams.delete('q');
 router.replace(url.toString());

 // fetch data
 setLoading(true);
 api.get(`/staffs${q ? `?q=${q}` : ''}`)
   .then(res => setUsers(res.data))
   .catch(console.error)
   .finally(() => setLoading(false));
}, [q]);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Search placeholder="Search for the user ..." />
                <Link href="/pages/admin/dashboard/users/add">
                    <button className={styles.addButton}>Add New</button>
                </Link>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Created At</td>
                        <td>Role</td>
                        <td>Status</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>{user.role.toUpperCase()}</td>
                            <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                            <td>
                                <div className={styles.buttons}>
                                    <Link href="/">
                                        <button className={`${styles.button} ${styles.view}`}>View</button>
                                    </Link>
                                    <Link href="/">
                                        <button className={`${styles.button} ${styles.delete}`}>Delete</button>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;
