// app/components/cohort/FacilitatorSelectPopup.jsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import FormModal from '@/app/components/Form/FormModal';
import api from '@/app/lib/utils/axios';

export default function FacilitatorSelectPopup({
  currentLevelFacilitators,
  onClose,
  onSelect
}) {
    console.log("FacilitatorSelectPopup props:", { currentLevelFacilitators, onClose, onSelect });
  const [allFacilitators, setAllFacilitators] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) fetch everyone
  useEffect(() => {
    let cancelled = false;
    api.get('/facilitators')
      .then(res => {
        if (!cancelled) setAllFacilitators(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error('Error fetching facilitators:', err))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  // 2) build dropdown options, excluding those already on this level
  const facilitatorOptions = useMemo(() => {
    return allFacilitators
      .filter(f => !currentLevelFacilitators.some(cf => cf.uuid === f.uuid))
      .map(f => ({ value: f.uuid, label: `${f.firstName} ${f.lastName}` }));
  }, [allFacilitators, currentLevelFacilitators]);

  // 3) define form fields
  const fields = [
    {
      name: 'facilitatorId',
      label: 'Facilitator',
      type: 'select',
      options: facilitatorOptions,
      disabled: loading
    },
    {
      name: 'specification',
      label: 'Specification',
      type: 'select',
      options: [
        { value: 'theory',   label: 'Theory Instructor' },
        { value: 'practical', label: 'Practical Instructor' }
      ]
    }
  ];

  const initialValues = {
    facilitatorId: '',
    specification: ''
  };

  const handleSubmit = (values) => {
    // values = { facilitatorId, specification }
    onSelect(values);
  };

  return (
    <FormModal
      title="Add Facilitator to Level"
      fields={fields}
      initialValues={initialValues}
      onAdd={() => {}}
      onSubmit={handleSubmit}
      onClose={onClose}
      onChange={() => {}}
      // no table content here
    />
  );
}

FacilitatorSelectPopup.propTypes = {
  currentLevelFacilitators: PropTypes.array.isRequired,
  onClose:                 PropTypes.func.isRequired,
  onSelect:                PropTypes.func.isRequired
};
