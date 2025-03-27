"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/styles/students/students.module.css";
import Swal from "sweetalert2";
import { config } from "/config";
import { MdSearch } from "react-icons/md";
import AddCohort from "@/app/pages/student/dashboard/cohorts/add/page";

const CohortsPage = () => {
    const [cohorts, setCohorts] = useState([]);
    const [filteredCohorts, setFilteredCohorts] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    useEffect(() => {
        fetchCohorts();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = cohorts.filter((cohort) =>
                cohort.cohortName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCohorts(filtered);
        } else {
            setFilteredCohorts(cohorts);
        }
    }, [searchQuery, cohorts]);

    const fetchCohorts = async () => {
        try {
            const response = await fetch(`${config.baseURL}/cohorts`);
            const data = await response.json();
            setCohorts(data);
            setFilteredCohorts(data);
        } catch (error) {
            console.error("Error fetching cohorts:", error);
        }
    };

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#1b9392",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${config.baseURL}/cohorts/${id}`, { method: "DELETE" })
                    .then((response) => {
                        if (response.ok) {
                            setCohorts(cohorts.filter((cohort) => cohort.id !== id));
                            setFilteredCohorts(filteredCohorts.filter((cohort) => cohort.id !== id));
                            Swal.fire("Deleted!", "The cohort has been deleted.", "success");
                        } else {
                            Swal.fire("Error!", "Failed to delete the cohort.", "error");
                        }
                    })
                    .catch(() => {
                        Swal.fire("Error!", "Something went wrong.", "error");
                    });
            }
        });
    };

    return (
        <div className={`${styles.container} ${isModalOpen ? styles.modalBackground : ""}`}>
            {/* Top bar */}
            <div className={styles.top}>
                <div className={styles.searchInput}>
                    <input
                        type="text"
                        placeholder="Search Cohorts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInputs}
                    />
                    <MdSearch />
                </div>
                <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                    Add New
                </button>
            </div>

            {/* Cohort Cards */}
            <div className={styles.gridContainer}>
                {filteredCohorts.map((cohort) => (
                    <div key={cohort.id} className={styles.card}>
                        {/* Dropdown menu */}
                        {openDropdown === cohort.id && (
                            <div className={styles.dropdownMenu}>
                                <Link href={`/pages/student/dashboard/cohorts/${cohort.uuid}`}>
                                    <button className={styles.dropdownItem}>View</button>
                                </Link>
                                <button className={styles.dropdownItem} onClick={() => console.log("Edit", cohort.id)}>
                                    Edit
                                </button>
                                <button className={styles.dropdownItem} onClick={() => handleDelete(cohort.id)}>
                                    Delete
                                </button>
                            </div>
                        )}

                        {/* Cohort Details */}
                        <p>
                            <strong>Cohort Name:</strong> {cohort.cohortName}
                        </p>
                        <div className={styles.cardHeader}>
                            <p>
                                <strong>Start Date:</strong> {cohort.startDate}
                            </p>
                            <div className={styles.dots}>
                                <button className={styles.menuButton} onClick={() => toggleDropdown(cohort.id)}>
                                    ⋮
                                </button>
                            </div>
                        </div>
                        <p>
                            <strong>End Date:</strong> {cohort.endDate}
                        </p>
                        <p>
                            <strong>Cohort Status:</strong> {cohort.status}
                        </p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <AddCohort isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default CohortsPage;
