"use client";


import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdSearch } from "react-icons/md";
import api from "@/app/lib/utils/axios";
import CardComponent from "@/app/components/card/CardComponents"; // Import the CardComponent
import CohortForm from "@/app/pages/student/dashboard/cohorts/add/page";
import CohortEditPopup from "@/app/components/cohort/CohortEditPopup";
import Toolbar from "@/app/components/toolBar/toolBar";
import { MdAdd, MdFilterList, MdVisibility, MdEdit, MdDelete, MdDownload  } from 'react-icons/md';

const CohortsPage = () => {
  const [cohorts, setCohorts] = useState([]);
  const [filteredCohorts, setFilteredCohorts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddNewPopup, setShowAddNewPopup] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [viewedCohortId, setViewedCohortId] = useState(null);


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
      const response = await api.get(`/cohorts`);
      const data = await response.data;
      setCohorts(data);
      setFilteredCohorts(data);
    } catch (error) {
      console.error("Error fetching cohorts:", error);
    }
  };

  const handleEditCohort = (cohort) => {
  setSelectedCohort(cohort);
  setIsEditPopupOpen(true);
};


const handleUpdateCohort = async (updatedCohortData) => {
  if (!selectedCohort?.uuid) {
    console.error("No cohort UUID specified.");
    return;
  }

  try {
    const response = await api.patch(`/cohorts/${selectedCohort.uuid}/update`, updatedCohortData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      setCohorts(cohorts.map(cohort =>
        cohort.id === selectedCohort.id ? { ...cohort, ...updatedCohortData } : cohort
      ));
      console.log('Cohort updated successfully');
    } else {
      console.error('Failed to update cohort');
    }
  } catch (error) {
    console.error('Error updating cohort:', error);
  }

  setIsEditPopupOpen(false);
};


  const handleAddNewClick = () => {
    setShowAddNewPopup(true);
  };

  const handleDelete = (uuid) => {
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
      api.delete(`/cohorts/${uuid}`)
        .then((response) => {
          if (response.status === 200) {
            setCohorts(cohorts.filter((cohort) => cohort.uuid !== uuid));
            setFilteredCohorts(filteredCohorts.filter((cohort) => cohort.uuid !== uuid));
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

      <div className="card-grid">
  {filteredCohorts.map((cohort) => (
    <CardComponent
      key={cohort.id}
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
