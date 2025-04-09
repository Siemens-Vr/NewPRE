"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/styles/staff/profile/profile.module.css";
import { FaUserCircle } from "react-icons/fa"; // Import user icon
import { config } from "@/config";
import style from "@/app/styles/staff/leave/leave.module.css";

const ProfilePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const uuid = searchParams.get("uuid");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });

    useEffect(() => {
        const fetchStaff = async () => {
            if (!uuid) return; // Don't fetch if UUID is missing

            setLoading(true);
            try {
                const response = await fetch(`${config.baseURL}/staffs/${uuid}`);
                if (!response.ok) throw new Error("Failed to fetch staff data");
                const data = await response.json();
                setUser(data);
                setFormData({ name: data.name, email: data.email }); // Prefill form
            } catch (error) {
                console.error("Error fetching staff:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [uuid]);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>No staff found.</p>;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await fetch(`${config.baseURL}/staffs/${uuid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Update error:", err);
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            {/* Personal Details Card */}
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Personal Information</h1>
                    <button className={styles.button} onClick={() => setIsModalOpen(true)}>
                        Update Profile
                    </button>
                </div>
                <div className={styles.details}>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>ID No:</strong> {user.idNo}</p>
                </div>
            </div>

            {/* Projects & Equipment Card */}
            <div className={styles.card}>
                <h2 className="text-xl font-semibold mb-4">Projects & Equipment</h2>
                {user.projects?.length > 0 ? (
                    <ul className={styles.list}>
                        {user.projects.map((project, index) => (
                            <li key={index}>
                                <strong>{project.name}</strong> - {project.equipment}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No projects assigned.</p>
                )} 
            </div>

            {/* Update Profile Modal */}
            {isModalOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContainer}>
           
                        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                                          {/* Close (X) Button */}
                            <button className={style.closeButton} onClick={() => setIsModalOpen(false)}>
                                &times;
                            </button>
                            <div className="mb-4">
                                <label className={styles.label}>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={style.modalInput}
                                />
                            </div>
                            <div className="mb-4">
                                <label className={styles.label}>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={style.modalInput}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.saveButton} onClick={handleUpdateProfile}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
