"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/utils/axios";
import MonitoringTable from "@/app/components/table/monitoringTable";
import Timeline from "@/app/components/Timeline/Timeline";
import Loading from "@/app/components/Loading/Loading";
import styles from "@/app/styles/project/report/report.module.css";

export default function MonitoringPage() {
  const { uuid } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch project
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: proj } = await api.get(`/projects/${uuid}`);
        setProject(proj);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (uuid) fetchData();
  }, [uuid]);

  // Gather all dates
  const allDates = useMemo(() => {
    if (!project?.milestones) return [];
    return project.milestones
      .flatMap(m => m.outputs || [])
      .map(o => new Date(o.createdAt).toLocaleDateString())
      .filter(Boolean);
  }, [project]);

  const handleDateClick = (dateStr) => {
    setFiltering(true);
    setTimeout(() => {
      setSelectedDate(prev => (prev === dateStr ? null : dateStr));
      setFiltering(false);
    }, 300);
  };

  // 👉 New: open documents for this output
  const handleRowClick = (output) => {
    const url = `${api.defaults.baseURL}/uploads/outputs/${output.document_name}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loading />
      </div>
    );
  }
  if (!project) {
    return (
      <div className={styles.loading}>
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{project.title} Monitoring</h1>

      <Timeline
        dates={allDates}
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
      />

      {filtering && (
        <div className={styles.loading}>
          <Loading />
        </div>
      )}

      {!filtering &&
        project.milestones.map((ms, idx) => {
          const rows = (ms.outputs || []).filter(o => {
            if (!selectedDate) return true;
            return new Date(o.createdAt).toLocaleDateString() === selectedDate;
          });

          return (
            <section key={ms.uuid} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {String.fromCharCode(65 + idx)}. {ms.title}
              </h2>

              <MonitoringTable
                columns={[
                  {
                    key: "name",
                    label: "Output Name",
                    render: o => `${o.no}. ${o.name}`
                  },
                  {
                    key: "latest",
                    label: "Latest Update",
                    render: o => new Date(o.createdAt).toLocaleDateString()
                  },
                  {
                    key: "progress",
                    label: "Progress",
                    render: o => {
                      const pct = Math.round(o.value * 100);
                      const bgColor =
                        pct === 100 ? "#4caf50" : pct === 0 ? "#f44336" : "#2196f3";
                      return (
                        <div className={styles.progressContainer}>
                          <div
                            className={styles.progressInner}
                            style={{ width: `${pct}%`, backgroundColor: bgColor }}
                          >
                            {pct}%
                          </div>
                        </div>
                      );
                    }
                  }
                ]}
                data={rows}
                onRowClick={handleRowClick}          // ← wire it up
                sortKey={null}
                sortOrder={null}
              />
            </section>
          );
        })}
    </div>
  );
}
