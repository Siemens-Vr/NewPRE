// CohortLevelModal.jsx
"use client";

import { useState, useEffect } from "react";
import api from "@/app/lib/utils/axios";
import FormModal from "@/app/components/Form/formTable";

export default function CohortLevelModal({ onClose, onSave }) {
  const [cohorts, setCohorts] = useState([]);
  const [levels, setLevels]   = useState([]);
  const [values, setValues]   = useState({
    cohortUuid:  "",
    levelUuid:   "",
    fee:         "",
    examResults: ""
  });

  useEffect(() => {
    api.get("/cohorts").then(r => setCohorts(r.data||[]));
  }, []);

  useEffect(() => {
    if (values.cohortUuid) {
      api.get(`/levels/${values.cohortUuid}`)
         .then(r => setLevels(r.data||[]));
    }
  }, [values.cohortUuid]);

  // Called when you click the FormModal “Add” button
  const handleAdd = () => {
    const c = cohorts.find(c=>c.uuid===values.cohortUuid);
    const l = levels.find(l=>l.uuid===values.levelUuid);
    if (!c || !l) return alert("Pick both cohort and level");

    const newRow = {
      cohortUuid:  values.cohortUuid,
      levelUuid:   values.levelUuid,
      cohortName:  c.cohortName,
      levelName:   l.levelName,
      fee:         values.fee,
      examResults: values.examResults,
    };
    // Immediately notify parent of this one row
    onSave(newRow);
    // then close the modal
    onClose();
  };

  return (
    <FormModal
      title="Add Cohort & Level"
      fields={[
        {
          name: "cohortUuid", label: "Cohort", type: "select",
          options: cohorts.map(c=>({value:c.uuid,label:c.cohortName})),
          required:true
        },
        {
          name: "levelUuid", label: "Level", type: "select",
          options: levels.map(l=>({value:l.uuid,label:l.levelName})),
          required:true,
          disabled: !values.cohortUuid
        },
        { name:"fee",         label:"Fee Paid",      type:"number" },
        { name:"examResults", label:"Exam Status",  type:"select",
          options:[
            {value:"pass",label:"Pass"},
            {value:"fail",label:"Fail"},
            {value:"no-show",label:"No Show"}
          ]
        }
      ]}
      initialValues={values}
      onChange={(v)=>setValues(v)}
      onAdd={handleAdd}
      onSubmit={onClose}    // we won’t use “Done”
      onClose={onClose}
      extraActions={[]}
    />
  );
}
