"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/utils/axios";
import styles from "@/app/styles/project/report/report.module.css";

export default function EditReportPage() {
  const { uuid } = useParams();
  const router = useRouter();

  const [project,    setProject]    = useState(null);
  const [phases,     setPhases]     = useState([]);
  const [dates,      setDates]      = useState({});
  const [rows,       setRows]       = useState({});
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const phaseKey = type => {
    switch (type) {
      case "Milestones":     return "milestones";
      case "Work Package":   return "milestones";
      case "Duration Years": return "milestones";
      default:               return null;
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const { data: proj } = await api.get(`/projects/${uuid}`);
        setProject(proj);

        const key = phaseKey(proj.type);
        if (!key || !Array.isArray(proj[key])) {
          throw new Error(`No phases for type ${proj.type}`);
        }
        setPhases(proj[key]);

        const initialDates = {};
        const initialRows  = {};

        await Promise.all(
          proj[key].map(async phase => {
            const { data: existing } = await api.get(`/outputs/${phase.uuid}`);
            if (existing.length) {
              initialDates[phase.uuid] = existing[0].date;
              initialRows[phase.uuid]  = existing.map(o => ({
                id:          o.id,
                no:          o.no,
                name:        o.name,
                description: o.description,
                value:       o.value,
                // if you need files, capture them here
              }));
            } else {
              initialDates[phase.uuid] = "";
              initialRows[phase.uuid]  = [{ name: "", description: "", value: "" }];
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

  // ←—— **THIS is the only changed handler** ——
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // flatten into one big array
      const payload = phases.flatMap(phase =>
        rows[phase.uuid].map(row => ({
          id:          row.id,
          phaseId:     phase.uuid,
          no:          row.no,
          name:        row.name,
          description: row.description,
          value:       row.value,
        }))
      );

      // send JSON bulk update
      await api.put(
        '/outputs/bulk-edit',
        { outputs: payload },
        { headers: { 'Content-Type': 'application/json' } }
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
        Editing {project.type} Outputs for {project.title}
      </h1>
      <p className={styles.description}>{project.description}</p>

      <form onSubmit={handleSubmit}>
        {phases.map((phase, pIndex) => (
          <section key={phase.uuid} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {String.fromCharCode(65 + pIndex)}. {phase.title || phase.name}
            </h2>

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
                      /* optionally stash files in row.files */
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
                  &times;
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
