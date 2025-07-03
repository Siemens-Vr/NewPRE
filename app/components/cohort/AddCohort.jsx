"use client";

import { useState, useEffect } from "react";
import styles from '@/app/styles/cohorts/addCohort/addCohort.module.css';
import api from '@/app/lib/utils/axios';
import FormModal from '@/app/components/Form/formTable';
import CohortModal from '@/app/components/cohort/AddCohort'; // optional modal

const AddCohortPage = ({ onClose, onSave }) => {
  const [cohorts, setCohorts] = useState([]);
  const [levels, setLevels] = useState([]);
  const [cohortLevelList, setCohortLevelList] = useState([]);
  const [showCohortModal, setShowCohortModal] = useState(false);

  const [formState, setFormState] = useState({
    cohortUuid: "",
    levelUuid: "",
    fee: "",
    examResults: "",
  });

  useEffect(() => {
    fetchCohorts();
  }, []);

  useEffect(() => {
    if (formState.cohortUuid) {
      fetchLevels(formState.cohortUuid);
    }
  }, [formState.cohortUuid]);

  const fetchCohorts = async () => {
    try {
      const response = await api.get(`/cohorts`);
      setCohorts(response.data);
    } catch (error) {
      console.error("Error fetching cohorts:", error);
    }
  };

  const fetchLevels = async (cohortUuid) => {
    try {
      const response = await api.get(`/levels/${cohortUuid}`);
      setLevels(response.data);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const handleSubmit = (values) => {
    if (!values.levelName) {
      alert("Please select a level.");
      return;
    }

    const cohortName = cohorts.find(c => c.uuid === values.cohortUuid)?.cohortName;
    const levelName = levels.find(l => l.uuid === values.levelUuid)?.levelName;

     const newEntry = {     
    cohortUuid: values.cohortUuid,
     levelUuid: values.levelName,
     cohortName,
     levelName,
     fee: values.fee,
    examResults: values.examResults,
   };

    setCohortLevelList(prev => [...prev, newEntry]);

    // Reset form
    setFormState({
      cohortUuid: "",
      levelUuid: "",
      fee: "",
      examResults: "",
    });
  };

  const handleDelete = (index) => {
    setCohortLevelList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(cohortLevelList);
    onClose();
  };



 const filteredLevels = levels;

  const fields = [
    {
      name: "cohortUuid",
      label: "Cohort",
      type: "select",
      options: cohorts.map(c => ({
        value: c.uuid,
        label: c.cohortName
      })),
      required: true
    },
    {
  name: "levelName",
  label: "Level",
  type: "select",
  required: true,
  options: filteredLevels.length
    ? filteredLevels.map(l => ({ value: l.uuid, label: l.levelName }))
    : [{ value: "", label: "No levels found" }],
  disabled: !formState.cohortUuid
},

    {
      name: "fee",
      label: "Fee Amount Paid",
      type: "number",
      required: false,
      placeholder: "Enter fee paid"
    },
    {
      name: "examResults",
      label: "Exam Result Status",
      type: "select",
      options: [
        { value: "pass", label: "Pass" },
        { value: "fail", label: "Fail" },
        { value: "no-show", label: "No Show" }
      ],
      required: false
    }
  ];

  return (
    <>
      <FormModal
        title="Add Cohort Level"
        fields={fields}
        initialValues={formState}
        onAdd={handleSubmit}
        onSubmit={handleSave}
        onClose={onClose}
        onChange={setFormState}
        extraActions={[
          { label: 'Add Level', onClick: () => setShowCohortModal(true), className: 'cancel' }
        ]}
        tableContent={
          cohortLevelList.length > 0 && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cohort</th>
                  <th>Level</th>
                  <th>Fee Payment</th>
                  <th>Exam Results</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cohortLevelList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.cohortName}</td>
                    <td>{item.levelName}</td>
                    <td>{item.fee}</td>
                    <td>{item.examResults}</td>
                    <td>
                      <button onClick={handleSave} className={styles.submit}>
                        Save
                      </button>
                      <button onClick={() => handleDelete(index)} className={styles.deleteButton}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      />
      {showCohortModal && <CohortModal onClose={() => setShowCohortModal(false)} />}
    </>
  );
};

export default AddCohortPage;
