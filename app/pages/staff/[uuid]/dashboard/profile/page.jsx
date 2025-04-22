"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/staff/profile/profile.module.css";
import { useParams } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { config } from "@/config";
import style from "@/app/styles/staff/leave/leave.module.css";

const ProfilePage = () => {
  const router = useRouter();
  const params = useParams()
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uuid = params?.uuid;

  useEffect(() => {
    const fetchStaff = async () => {
      if (!uuid) return;
  
      setLoading(true);
      try {
        const response = await fetch(`${config.baseURL}/staffs/${uuid}`);
        if (!response.ok) throw new Error("Failed to fetch staff data");
        const data = await response.json();
  
        setUser(data);
  
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          gender: data.gender || "",
          phoneNumber: data.phoneNumber || "",
          idNumber: data.idNumber || "",
          dateJoined: data.dateJoined?.split("T")[0] || "",
          role: data.role || "",
        });
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStaff();
  }, [uuid]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${config.baseURL}/staffs/${user.uuid}`, {
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

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No staff found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Personal Information</h1>
          <button className={styles.button} onClick={() => setIsModalOpen(true)}>
            Update Profile
          </button>
        </div>
        <div className={styles.details}>
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>ID Number:</strong> {user.idNumber}</p>
          <p><strong>Date Joined:</strong> {user.dateJoined?.split("T")[0]}</p>
          <p><strong>Role:</strong> {user.role}</p>
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

      {isModalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContainer}>
            <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <button className={style.closeButton} onClick={() => setIsModalOpen(false)}>
                &times;
              </button>

              {[
                { name: "firstName", label: "First Name" },
                { name: "lastName", label: "Last Name" },
                { name: "email", label: "Email" },
                { name: "gender", label: "Gender" },
                { name: "phoneNumber", label: "Phone Number" },
                { name: "idNumber", label: "ID Number" },
                { name: "dateJoined", label: "Date Joined", type: "date" },
                { name: "role", label: "Role" },
              ].map(({ name, label, type = "text" }) => (
                <div className="mb-4" key={name}>
                  <label className={styles.label}>{label}:</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={style.modalInput}
                  />
                </div>
              ))}

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
