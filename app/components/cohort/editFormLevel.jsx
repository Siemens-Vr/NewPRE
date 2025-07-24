"use client";

import React, { useState, useEffect } from "react";
import FormModal from "@/app/components/Form/FormModal";
import Spinner from "@/app/components/spinner/spinner";

const levelOptions = [
  { value: "SMSCP Level 1", label: "SMSCP Level 1" },
  { value: "SMSCP Level 2", label: "SMSCP Level 2" },
  { value: "SMSCP Level 3", label: "SMSCP Level 3" },
];

// helper to format ISO strings for <input type="date">
const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toISOString().split("T")[0];
};

const EditLevelForm = ({
  initialValues,
  cohortStartDate,
  cohortEndDate,
  onSave,
  onClose,
}) => {
  // 1) Hooks at the top level
  const [formValues, setFormValues] = useState({
    uuid: "",
    levelName: "",
    startDate: "",
    endDate: "",
    exam_dates: "",
    exam_quotation_number: "",
  });
  const [levelDateError, setLevelDateError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2) When initialValues loads, populate formValues
  useEffect(() => {
    if (!initialValues) return;

    setFormValues({
      uuid: initialValues.uuid || "",
      levelName: initialValues.levelName || "",
      startDate: formatDate(initialValues.startDate),
      endDate: formatDate(initialValues.endDate),
      exam_dates:
        formatDate(initialValues.exam_dates) ||
        formatDate(initialValues.examDates),
      exam_quotation_number:
        initialValues.exam_quotation_number ||
        initialValues.examQuotationNumber ||
        "",
    });
    // clear any prior errors when loading new data
    setLevelDateError("");
  }, [initialValues]);

  // 3) Show loader until initialValues exist
  if (!initialValues) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          flexDirection: "column",
        }}
      >
        <Spinner />
        <span style={{ marginTop: 10 }}>Loading level data…</span>
      </div>
    );
  }

  // 4) Validation & handlers
  const validateDates = () => {
    const s = new Date(formValues.startDate);
    const e = new Date(formValues.endDate);
    const cs = new Date(cohortStartDate);
    const ce = new Date(cohortEndDate);

    if (s >= e) {
      setLevelDateError("End date must be after start date.");
      return false;
    }
    if (cohortStartDate && cohortEndDate) {
      if (s < cs || e > ce) {
        setLevelDateError("Level dates must be within cohort dates.");
        return false;
      }
    }
    setLevelDateError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateDates()) return;
    if (!formValues.levelName) {
      alert("Please select a level");
      return;
    }

    setLoading(true);
    try {
      await onSave(formValues);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update level, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (updates) => {
    setFormValues((prev) => ({ ...prev, ...updates }));
  };

  // 5) Define your FormModal fields
  const fields = [
    {
      name: "levelName",
      label: "Level",
      type: "select",
      options: levelOptions,
      required: true,
      value: formValues.levelName,
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      required: true,
      value: formValues.startDate,
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
      required: true,
      value: formValues.endDate,
    },
    {
      name: "exam_dates",
      label: "Exam Date",
      type: "date",
      value: formValues.exam_dates,
    },
    {
      name: "exam_quotation_number",
      label: "Exam Quotation Number",
      type: "text",
      value: formValues.exam_quotation_number,
    },
  ];

  return (
    <FormModal
      title="Edit Level"
      fields={fields}
      initialValues={formValues}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onClose={onClose}
      submitText={loading ? "Updating…" : "Update Level"}
      loading={loading}
      errorMessage={levelDateError}
    />
  );
};

export default EditLevelForm;
