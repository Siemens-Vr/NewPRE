"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/monitoringTable";
import Timeline from "@/app/components/Timeline/Timeline";
import Loading from "@/app/components/Loading/Loading";
import styles from "@/app/styles/project/report/report.module.css";

export default function MonitoringPage() {
  const { uuid } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch project with nested outputs
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

  // Collect all output dates across milestones
  const allDates = useMemo(() => {
    if (!project?.milestones) return [];
    return project.milestones
      .flatMap((milestone) => milestone.outputs || [])
      .map((o) => o.createdAt)
      .filter(Boolean);
  }, [project]);

  const handleDateClick = (dateStr) => {
    setFiltering(true);
    setTimeout(() => {
      setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
      setFiltering(false);
    }, 300);
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

      {/* Timeline */}
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

      {/* Render table for each milestone */}
      {!filtering &&
        project.milestones.map((item, idx) => {
          // Filter outputs by selected date
          const rows = (item.outputs || []).filter((o) => {
            if (!selectedDate) return true;
            return new Date(o.createdAt).toLocaleDateString() === selectedDate;
          });

          return (
            <section key={item.uuid} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {String.fromCharCode(65 + idx)}. {item.title}
              </h2>

              <Table
                columns={[
                  {
                    key: "name",
                    label: "Output Name",
                    render: (o) => `${o.no}. ${o.name}`,
                  },
                  {
                    key: "latest",
                    label: "Latest Update",
                    render: (o) => new Date(o.createdAt).toLocaleDateString(),
                  },
                  {
                    key: "progress",
                    label: "Progress",
                    render: (o) => {
                      const pct = Math.round(o.value * 100);
                      // decide color
                       let bgColor;
                      if (pct === 0) {
                        bgColor = "#2196f3";     // red
                      } else if (pct === 100) {
                        bgColor = "#4caf50";      // green
                      } else {
                        bgColor = "#2196f3";      // blue
                      }
                      // you can keep text white for contrast
                      return (
                        <div className={styles.progressContainer}>
                          <div
                            className={styles.progressInner}
                            style={{
                              width: `${pct}%`,
                              backgroundColor: bgColor,
                              color: "#000",
                            }}
                          >
                            {`${pct}%`}
                          </div>
                        </div>
                      );
                    },
                  },
                ]}
                data={rows}
                onSort={null}
                sortKey={null}
                sortOrder={null}
              />
            </section>
          );
        })}
    </div>
  );
}
