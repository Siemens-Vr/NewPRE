// app/components/project/report/ReportPage.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/app/lib/utils/axios';
import styles from '@/app/styles/project/report/report.module.css';

export default function ReportPage() {
  const { uuid } = useParams();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [datesByMilestone, setDatesByMilestone] = useState({});
  const [rowsByMilestone, setRowsByMilestone] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Initialize on load
  useEffect(() => {
    async function load() {
      try {
        const { data: projectData } = await api.get(`/projects/${uuid}`);
        setProject(projectData);

        const d = {}, r = {};
        (projectData.milestones || []).forEach(m => {
          d[m.uuid] = '';
          r[m.uuid] = [{ no: '', name: '', description: '', value: '', documents: [] }];
        });
        setDatesByMilestone(d);
        setRowsByMilestone(r);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [uuid]);

  // Handlers
  const handleDateChange = (mid, date) => {
    setDatesByMilestone(prev => ({ ...prev, [mid]: date }));
  };

  const handleRowChange = (mid, idx, field, val) => {
    setRowsByMilestone(prev => ({
      ...prev,
      [mid]: prev[mid].map((row, i) => (i === idx ? { ...row, [field]: val } : row))
    }));
  };

  const addRow = mid => {
    setRowsByMilestone(prev => ({
      ...prev,
      [mid]: [...prev[mid], { no: '', name: '', description: '', value: '', documents: [] }]
    }));
  };

  const removeRow = (mid, idx) => {
    setRowsByMilestone(prev => ({
      ...prev,
      [mid]: prev[mid].filter((_, i) => i !== idx)
    }));
  };

  // Submit bulk
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    // Build JSON payload
    const payload = project.milestones.map(m => {
      const mid = m.uuid;
      return {
        milestoneId: mid,
        date: datesByMilestone[mid],
        outputs: rowsByMilestone[mid].map(r => ({
          no: Number(r.no),
          name: r.name,
          description: r.description,
          value: Number(r.value)
        }))
      };
    });

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    try {
      await api.post('/outputs', payload);
      router.push(`/projects/${uuid}/report`);
    } catch (err) {
      console.error('Bulk create error:', err.response?.data || err.message);
      alert('Failed to submit outputs: ' + (err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{project.title} — Outputs</h1>
      <p className={styles.description}>{project.description}</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {project.milestones.map((m, idx) => {
          const mid = m.uuid;
          return (
            <div key={mid} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {String.fromCharCode(65 + idx)}. {m.title || m.name}
              </h2>

              <div className={styles.fieldGroup}>
                <label>Date</label>
                <input
                  type="date"
                  value={datesByMilestone[mid]}
                  onChange={e => handleDateChange(mid, e.target.value)}
                  className={styles.dateInput}
                  required
                />
              </div>

              {rowsByMilestone[mid].map((r, ri) => (
                <div key={ri} className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label>No.</label>
                    <input
                      type="number"
                      min="1"
                      value={r.no}
                      onChange={e => handleRowChange(mid, ri, 'no', e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Name</label>
                    <input
                      type="text"
                      value={r.name}
                      onChange={e => handleRowChange(mid, ri, 'name', e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Description</label>
                    <input
                      type="text"
                      value={r.description}
                      onChange={e => handleRowChange(mid, ri, 'description', e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Documents</label>
                    <input
                      type="file"
                      multiple
                      onChange={e => handleRowChange(mid, ri, 'documents', Array.from(e.target.files))}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                      <label>Value</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      value={r.value}
                      onChange={e => handleRowChange(mid, ri, 'value', e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>

                  <button type="button" className={styles.remove} onClick={() => removeRow(mid, ri)}>
                    ×
                  </button>
                </div>
              ))}

              <button type="button" className={styles.addRow} onClick={() => addRow(mid)}>
                + Add row
              </button>
            </div>
          );
        })}

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit All'}
        </button>
      </form>
    </div>
  );
}
