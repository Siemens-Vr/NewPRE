// app/pages/project/dashboard/[uuid]/[phaseuuid]/monitoring/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/monitoringTable";
import Timeline from "@/app/components/Timeline/Timeline";
import Loading from "@/app/components/Loading/Loading";
import styles from "@/app/styles/project/report/report.module.css";

export default function MonitoringPage() {
  const { uuid, phaseuuid } = useParams();

  const [project, setProject] = useState(null);
  const [outputsByItem, setOutputsByItem] = useState({});
  const [loading, setLoading] = useState(true);

  // for showing spinner when changing the date filter
  const [filtering, setFiltering] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // 1) Initial data fetch
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: proj } = await api.get(`/projects/${uuid}`);
        setProject(proj);

        const temp = {};
        await Promise.all(
          (proj.milestones || []).map(async (item) => {
            const res = await api.get(`/outputs/${item.uuid}`);
            temp[item.uuid] = res.data;
          })
        );
        setOutputsByItem(temp);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (uuid && phaseuuid) fetchData();
  }, [uuid, phaseuuid]);

  // 2) Prepare allDates & items
  const allDates = React.useMemo(
    () =>
      Object.values(outputsByItem)
        .flat()
        .map((o) => o.createdAt)
        .filter(Boolean),
    [outputsByItem]
  );
  const items = project?.milestones || [];

  // 3) Handle click on a timeline dot
  const handleDateClick = (dateStr) => {
    // if clicking same date, we'll clear; otherwise switch
    setFiltering(true);
    setTimeout(() => {
      setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
      setFiltering(false);
    }, 300); // simulate a 300ms loading
  };

  // 4) While fetching initial data:
  if (loading) {
    return (
      <div className={styles.loading}>
        <Loading />
      </div>
    );
  }

  // 5) No project found?
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

      {/* Filtering spinner */}
      {filtering && (
        <div className={styles.loading}>
          <Loading />
        </div>
      )}

      {/* Filter info + clear button */}

      {/* Tables per milestone */}
      {!filtering &&
        items.map((item, idx) => {
          const rows = (outputsByItem[item.uuid] || []).filter((o) => {
            if (!selectedDate) return true;
            return (
              new Date(o.createdAt).toLocaleDateString() === selectedDate
            );
          });

          return (
            <section key={item.uuid} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {String.fromCharCode(65 + idx)}. {item.title || item.name}
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
                    render: (o) =>
                      new Date(o.createdAt).toLocaleDateString(),
                  },
                  {
                    key: "progress",
                    label: "Progress",
                    render: o => {
                      const pct = o.value * 100;
                      const units = o.value === 1 ? 1 : 0;
                      return (
                        <div className={styles.progressContainer}>
                          <div
                            className={styles.progressInner}
                            style={{ width: `${pct}%` }}
                          >
                            {`${units} units (${pct}%)`}
                          </div>
                        </div>
                      );
                    }
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
