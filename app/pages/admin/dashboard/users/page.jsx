import { fetchUsers } from '@/app/lib/data';
import styles from '@/app/styles/users/users.module.css';
import Search from '@/app/components/search/search';
import Link from "next/link";

const UsersPage = async () => {
    const data = await fetchUsers();
    const users = data.users;
    console.log(users);

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
