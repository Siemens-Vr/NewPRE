'use client'
import api from '@/app/lib/utils/axios';
import styles from '@/app/styles/users/users.module.css';
import Search from '@/app/components/search/search';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react';

const UsersPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState('');
    const [users, setUsers] = useState([]);

    // 2. on mount, read ?q= from the URL
    useEffect(() => {
        const queryParam = searchParams.get('q') || '';
        setQ(queryParam);
    }, [searchParams]);

    // 3. whenever q changes, push it into the URL and re-fetch
    useEffect(() => {
        // update the URL
        const params = new URLSearchParams(searchParams);
        if (q) {
            params.set('q', q);
        } else {
            params.delete('q');
        }
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.replace(newUrl);

        // fetch data
        setLoading(true);
        api.get(`/staffs${q ? `?q=${q}` : ''}`)
            .then(res => setUsers(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [q, router, searchParams]);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Search placeholder="Search for the user ..." />
                <Link href="/admin/dashboard/users/add">
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

const UsersPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UsersPageContent />
        </Suspense>
    );
};

export default UsersPage;