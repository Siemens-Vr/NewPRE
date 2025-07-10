// app/pages/project/dashboard/[uuid]/[phaseuuid]/monitoring/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/app/lib/utils/axios';
import Table from '@/app/components/table/Table';
import styles from '@/app/styles/project/report/report.module.css';
// import { co } from '@fullcalendar/core/internal-common';

export default function MonitoringPage() {
  const { uuid, phaseuuid } = useParams();
  const [project, setProject] = useState(null);
  const [outputsByItem, setOutputsByItem] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch project details
        const { data: proj } = await api.get(`/projects/${uuid}`);
        setProject(proj);
        // console.log('Project data:', proj);

        // Determine list key based on project type
        const key = proj.type === 'Milestones'
          ? 'milestones'
          : proj.type === 'Work Package'
          ? 'milestones'
          : proj.type === 'Duration Years'
          ? 'milestones'
          : 'milestones';

        // Fetch outputs for each item
        const temp = {};
        await Promise.all(
          (proj[key] || []).map(async (item) => {
            const res = await api.get(`/outputs/${item.uuid}`);
            temp[item.uuid] = res.data;
            // console.log(`Outputs for ${item.uuid}:`, res.data);
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

  if (loading) return <div className={styles.loading}>Loading monitoring data…</div>;
  if (!project) return <div className={styles.loading}>Project not found</div>;

  // Determine list of items to monitor
  const listKey = project.type === 'Milestones'
    ? 'milestones'
    : project.type === 'Work Package'
    ? 'milestones'
    : project.type === 'Duration Years'
    ? 'milestones'
    : 'milestones';
  const items = project[listKey] || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{project.title} Monitoring</h1>

      {items.map((item, idx) => (
        <section key={item.uuid} className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {String.fromCharCode(65 + idx)}. {item.title || item.name}
          </h2>

          <Table
            columns={[
              {
                key: 'name',
                label: 'Output Name',
                render: o => `${o.no}. ${o.name}`
              },
              {
                key: 'latest',
                label: 'Latest Update',
                render: o => new Date(o.createdAt).toLocaleDateString()
              },
              {
                key: 'progress',
                label: 'Progress',
                render: o => (
                  <>
                    <div className={styles.progressBarOuter}>
                      <div
                        className={styles.progressBarInner}
                        style={{ width: o.value === 1 ? '100%' : '0%' }}
                      />
                    </div>
                    <span className={styles.progressLabel}>
                      {o.value === 1 ? '100%' : '0%'}
                    </span>
                  </>
                )
              }
            ]}
            data={outputsByItem[item.uuid] || []}
            onSort={null}
            sortKey={null}
            sortOrder={null}
          />
        </section>
      ))}
    </div>
  );
}
