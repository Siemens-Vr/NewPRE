"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdFilterList, MdAdd } from 'react-icons/md';
import api from "@/app/lib/utils/axios";
import CardComponent from "@/app/components/card/CardComponents"; // Import the CardComponent
import CohortForm from "@/app/pages/student/dashboard/cohorts/add/page";
import CohortEditPopup from "@/app/components/cohort/CohortEditPopup";
import Toolbar from "@/app/components/toolBar/toolBar";
import Loading from '@/app/components/Loading/Loading';
import EmptyState from '@/app/components/EmptyState/EmptyState';

const CohortsPage = () => {
  const [cohorts, setCohorts] = useState([]);
  const [filteredCohorts, setFilteredCohorts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddNewPopup, setShowAddNewPopup] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCohorts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = cohorts.filter(cohort =>
        cohort.cohortName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCohorts(filtered);
    } else {
      setFilteredCohorts(cohorts);
    }
  }, [searchQuery, cohorts]);

  const fetchCohorts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/cohorts`);
      const data = response.data;
      setCohorts(data);
      setFilteredCohorts(data);
    } catch (error) {
      console.error("Error fetching cohorts:", error);
      Swal.fire('Error', 'Failed to load cohorts list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCohort = cohort => {
    setSelectedCohort(cohort);
    setIsEditPopupOpen(true);
  };

  const handleUpdateCohort = async updatedCohortData => {
    if (!selectedCohort?.uuid) return;
    try {
      const response = await api.patch(
        `/cohorts/${selectedCohort.uuid}/update`,
        updatedCohortData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        setCohorts(prev => prev.map(c =>
          c.uuid === selectedCohort.uuid ? { ...c, ...updatedCohortData } : c
        ));
        setFilteredCohorts(prev => prev.map(c =>
          c.uuid === selectedCohort.uuid ? { ...c, ...updatedCohortData } : c
        ));
        Swal.fire('Success', 'Cohort updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating cohort:', error);
      Swal.fire('Error', 'Failed to update cohort', 'error');
    }
    setIsEditPopupOpen(false);
  };

  const handleDelete = uuid => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#1b9392",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        api.delete(`/cohorts/${uuid}`)
          .then(response => {
            if (response.status === 200) {
              setCohorts(prev => prev.filter(c => c.uuid !== uuid));
              setFilteredCohorts(prev => prev.filter(c => c.uuid !== uuid));
              Swal.fire('Deleted!', 'The cohort has been deleted.', 'success');
            }
          })
          .catch(() => {
            Swal.fire('Error!', 'Something went wrong.', 'error');
          });
      }
    });
  };

  return (
    <div className="container">
      <Toolbar
        placeholder="Search cohorts..."
        buttons={[
          {
            label: 'Filter',
            onClick: () => {},
            variant: 'secondary',
            icon: MdFilterList
          },
          {
            label: 'Add New',
            onClick: () => setShowAddNewPopup(true),
            variant: 'primary',
            icon: MdAdd
          },
        ]}
      />

      {showAddNewPopup && <CohortForm onClose={() => setShowAddNewPopup(false)} />}

      {loading ? (
        <Loading text="Loading cohorts..." />
      ) : filteredCohorts.length > 0 ? (
        <div className="card-grid">
          {filteredCohorts.map(cohort => (
            <CardComponent
              key={cohort.uuid}
              cohort={cohort}
              title={cohort.cohortName}
              details={{
                StartDate: cohort.startDate,
                EndDate: cohort.endDate,
                Status: cohort.status,
              }}
              href={`/pages/student/dashboard/cohorts/${cohort.uuid}`}
              onUpdate={() => handleEditCohort(cohort)}
              onDelete={() => handleDelete(cohort.uuid)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          illustration="/undraw_no-data_ig65.svg"
          message="No cohorts found"
          details="You haven’t created any cohorts yet. Start by adding a cohort now."
          actionLabel="Add New Cohort"
          onAction={() => setShowAddNewPopup(true)}
        />
      )}

      {isEditPopupOpen && (
        <CohortEditPopup
          cohortData={selectedCohort}
          onClose={() => setIsEditPopupOpen(false)}
          onUpdate={handleUpdateCohort}
        />
      )}
    </div>
  );
};

export default CohortsPage;
