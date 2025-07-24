"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdFilterList, MdAdd } from 'react-icons/md';
import api from "@/app/lib/utils/axios";
import CardComponent from "@/app/components/card/CardComponent";
import CohortForm from "@/app/student/dashboard/cohorts/add/page";
import CohortEditPopup from "@/app/components/cohort/CohortEditPopup";
import Toolbar from "@/app/components/ToolBar/ToolBar";
import Loading from '@/app/components/Loading/Loading';
import EmptyState from '@/app/components/EmptyState/EmptyState';
import FormModal from "@/app/components/Form/FormModal";

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState([]);
  const [filteredCohorts, setFilteredCohorts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Add / edit
  const [showAddNewPopup, setShowAddNewPopup] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  // Archive modal
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveTarget, setArchiveTarget]     = useState(null);
  const [message, setMessage]                 = useState(null);
  const [error, setError]                     = useState(null);

  const archiveFields = [
    {
      name: "reason",
      label: "Reason for archiving",
      type: "select",
      options: [
        { value: "Completed",          label: "Completed" },
        { value: "No longer relevant", label: "No longer relevant" },
        { value: "Other",              label: "Other" },
      ],
    },
  ];

  // Fetch cohorts
  const fetchCohorts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/cohorts");
      setCohorts(data);
      setFilteredCohorts(data);
    } catch {
      Swal.fire("Error", "Failed to load cohorts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohorts();
  }, []);

  // Filter search
  useEffect(() => {
    if (searchQuery) {
      setFilteredCohorts(cohorts.filter(c =>
        c.cohortName.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setFilteredCohorts(cohorts);
    }
  }, [searchQuery, cohorts]);

  // Edit
  const handleEditCohort = cohort => {
    setSelectedCohort(cohort);
    setIsEditPopupOpen(true);
  };

  const handleUpdateCohort = async updatedData => {
    if (!selectedCohort) return;
    try {
      await api.patch(
        `/cohorts/${selectedCohort.uuid}/update`,
        updatedData
      );
      setCohorts(prev => prev.map(c =>
        c.uuid === selectedCohort.uuid ? { ...c, ...updatedData } : c
      ));
      Swal.fire("Success", "Cohort updated", "success");
    } catch {
      Swal.fire("Error", "Failed to update cohort", "error");
    }
    setIsEditPopupOpen(false);
  };

  // Open archive modal
  const openArchiveModal = (cohort) => {
    setArchiveTarget(cohort);
    setShowArchiveModal(true);
    setMessage(null);
    setError(null);
  };

  // Archive action
  const handleArchive = async ({ reason }) => {
    setShowArchiveModal(false);
    if (!archiveTarget) return;

    try {
      await api.post(`/cohorts/${archiveTarget.uuid}/archive`, { reason });
      setMessage(`“${archiveTarget.cohortName}” archived.`);
      // remove from lists
      setCohorts(prev => prev.filter(c => c.uuid !== archiveTarget.uuid));
      setFilteredCohorts(prev => prev.filter(c => c.uuid !== archiveTarget.uuid));
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Archived", timer: 2000, showConfirmButton: false });
    } catch (err) {
      const msg = err.response?.data?.message || "Archive failed";
      setError(msg);
      Swal.fire("Error", msg, "error");
    }
    setArchiveTarget(null);
  };

  return (
    <div className="container">
      <Toolbar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search cohorts..."
        buttons={[
          { label: 'Filter', variant: 'secondary', icon: MdFilterList },
          { label: 'Add New', onClick: () => setShowAddNewPopup(true), variant: 'primary', icon: MdAdd },
        ]}
      />

      {message && <div className="text-green-600 my-2">{message}</div>}
      {error   && <div className="text-red-600 my-2">{error}</div>}

      {showAddNewPopup && (
        <CohortForm onClose={() => setShowAddNewPopup(false)} onAdded={fetchCohorts} />
      )}

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
                EndDate:   cohort.endDate,
              }}
              href={`/student/dashboard/cohorts/${cohort.uuid}`}
              onUpdate={() => handleEditCohort(cohort)}
              onArchive={() => openArchiveModal(cohort)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          illustration="/undraw_no-data_ig65.svg"
          message="No cohorts found"
          details="You haven’t created any cohorts yet."
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

      {showArchiveModal && (
        <FormModal
          isOpen
          title={`Archive "${archiveTarget?.cohortName}"`}
          fields={archiveFields}
          initialValues={{ reason: "" }}
          onSubmit={handleArchive}
          onClose={() => setShowArchiveModal(false)}
          extraActions={[]}
        />
      )}
    </div>
  );
}
