// app/projects/[uuid]/[phaseuuid]/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/utils/axios";
import styles from "@/app/styles/project/report/report.module.css";

export default function EditReportPage() {
  const { uuid } = useParams();
  const router = useRouter();

  // project metadata
  const [project, setProject] = useState(null);
  // all phases (milestones / workpackages / durationyears)
  const [phases, setPhases]   = useState([]);
  // per-phase form state
  const [dates,  setDates]    = useState({}); // { [phaseId]: "YYYY-MM-DD" }
  const [rows,   setRows]     = useState({}); // { [phaseId]: [ { id?, name, description, value } ] }

  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [submitting,setSubmitting]= useState(false);

  // helper: map project.type → key in project object
  const phaseKey = type => {
    switch (type) {
      case "Milestones":     return "milestones";
      case "Work Package":   return "workpackages";
      case "Duration Years": return "durationyears";
      default:               return null;
    }
  };

  // load project + all phases + existing outputs per phase
  useEffect(() => {
    async function load() {
      try {
        // 1) project metadata
        const { data: proj } = await api.get(`/projects/${uuid}`);
        setProject(proj);

        // 2) pick the right phases array
        const key = phaseKey(proj.type);
        if (!key || !Array.isArray(proj[key])) {
          throw new Error(`No phases for type ${proj.type}`);
        }
        setPhases(proj[key]);

        // 3) for each phase, fetch its outputs
        const initialDates = {};
        const initialRows  = {};
        await Promise.all(
          proj[key].map(async phase => {
            const { data: existing } = await api.get(`/outputs/${phase.uuid}`);
            if (existing.length) {
              // they all share the same date field
              initialDates[phase.uuid] = existing[0].date;
              initialRows[phase.uuid] = existing.map(o => ({
                id: o.id,
                name: o.name,
                description: o.description,
                value: o.value,
              }));
            } else {
              initialDates[phase.uuid] = "";
              initialRows[phase.uuid] = [{ name:"", description:"", value:"" }];
            }
          })
        );
        setDates(initialDates);
        setRows(initialRows);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [uuid]);

  // form handlers
  const handleDateChange = (phaseId, newDate) =>
    setDates(d => ({ ...d, [phaseId]: newDate }));

  const handleRowChange = (phaseId, idx, field, val) =>
    setRows(r => ({
      ...r,
      [phaseId]: r[phaseId].map((row,i) =>
        i===idx ? { ...row, [field]: val } : row
      )
    }));

  const addRow = phaseId =>
    setRows(r => ({
      ...r,
      [phaseId]: [...r[phaseId], { name:"", description:"", value:"" }]
    }));

  const removeRow = (phaseId, idx) =>
    setRows(r => ({
      ...r,
      [phaseId]: r[phaseId].filter((_,i) => i!==idx)
    }));

  // on submit: for each phase, for each row → either PUT or POST
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await Promise.all(
        phases.flatMap(phase => {
          return rows[phase.uuid].map(row => {
            const form = new FormData();
            form.append("date", dates[phase.uuid]);
            form.append("name", row.name);
            form.append("description", row.description);
            form.append("value", row.value);

            if (row.id) {
              // update
              return api.put(`/outputs/update/${row.id}`, form, {
                headers: { "Content-Type": "multipart/form-data" }
              });
            } else {
              // create
              return api.post(`/outputs/${phase.uuid}`, form, {
                headers: { "Content-Type": "multipart/form-data" }
              });
            }
          });
        })
      );

      router.push(`/projects/${uuid}`);
    } catch (err) {
      console.error(err);
      alert("Save failed: " + (err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Edit {project.type} Outputs — {project.title}
      </h1>
      <p className={styles.description}>{project.description}</p>

      <form onSubmit={handleSubmit}>
        {phases.map((phase, pIndex) => (
          <section key={phase.uuid} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {String.fromCharCode(65 + pIndex)}. {phase.title || phase.name}
            </h2>

            <div className={styles.fieldGroup}>
              <label>Date (dd/mm/yyyy)</label>
              <input
                type="date"
                value={dates[phase.uuid]}
                onChange={e => handleDateChange(phase.uuid, e.target.value)}
                className={styles.dateInput}
                required
              />
            </div>

            {rows[phase.uuid].map((row, idx) => (
              <div key={idx} className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label>No.</label>
                  <input
                    type="number"
                    value={row.no || ""}
                    disabled
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Name</label>
                  <input
                    type="text"
                    value={row.name}
                    onChange={e => handleRowChange(phase.uuid, idx, "name", e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Description</label>
                  <input
                    type="text"
                    value={row.description}
                    onChange={e => handleRowChange(phase.uuid, idx, "description", e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Documents</label>
                  <input
                    type="file"
                    multiple
                    onChange={e => {
                      /* handle file uploads if you want */
                    }}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Value</label>
                  <input
                    type="number"
                    value={row.value}
                    onChange={e => handleRowChange(phase.uuid, idx, "value", e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => removeRow(phase.uuid, idx)}
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              className={styles.addRow}
              onClick={() => addRow(phase.uuid)}
            >
              + Add row
            </button>
          </section>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className={styles.submit}
        >
          {submitting ? "Saving…" : "Save All Outputs"}
        </button>
      </form>
    </div>
  );
}
