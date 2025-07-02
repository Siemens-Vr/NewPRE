import React, { useEffect, useState } from 'react';
import FormModal from '@/app/components/Form/FormModal';  // Import your reusable modal
import api from '@/app/lib/utils/axios';
import FacilitatorPopup from "@/app/components/cohort/FacilitatorPopUp";

const LevelAddPopUp = ({ cohortId, onClose, onAdd, onUpdate, initialValues = null }) => {
  const [facilitators, setFacilitators] = useState([]);
  const [selectedFacilitator, setSelectedFacilitator] = useState(null);
  const [showFacilitatorPopup, setShowFacilitatorPopup] = useState(false);
  const [facilitatorsList, setFacilitatorsList] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formValues, setFormValues] = useState({
    levelName: '',
    startDate: '',
    endDate: '',
    exam_dates: '',
    exam_quotation_number: '',
    facilitators: []
  });


  useEffect(() => {
    const fetchFacilitators = async () => {
      try {
        const res = await api.get(`/facilitators`);
        setFacilitatorsList(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching facilitators:", err);
        setFacilitatorsList([]);
      }
    };
    fetchFacilitators();
  }, []);

  const addFacilitator = () => {
    if (selectedFacilitator && selectedRole) {
      const updated = [...formValues.facilitators, {
        value: selectedFacilitator.value,
        label: selectedFacilitator.label,
        role: selectedRole.value
      }];
      setFormValues({ ...formValues, facilitators: updated });
      setSelectedFacilitator(null);
      setSelectedRole(null);
    }
  };

  const removeFacilitator = (index) => {
    const updated = [...formValues.facilitators];
    updated.splice(index, 1);
    setFormValues({ ...formValues, facilitators: updated });
  };

 const handleSubmit = () => {
  const payload = {
    ...formValues,
    cohortId: cohortId,
    facilitatorRoles: formValues.facilitators.map(f => ({
      facilitatorId: f.value,
      role: f.role
    }))
  };

  if (initialValues && onUpdate) {
    onUpdate(payload);
  } else {
    onAdd(payload);
  }

  onClose();
};


  const fields = [
    {
      name: 'levelName',
      label: 'Level Name',
      type: 'select',
      options: [
        { value: 'SMSCP Level 1', label: 'SMSCP Level 1' },
        { value: 'SMSCP Level 2', label: 'SMSCP Level 2' },
        { value: 'SMSCP Level 3', label: 'SMSCP Level 3' }
      ]
    },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    { name: 'exam_dates', label: 'Exam Date', type: 'date' },
    { name: 'exam_quotation_number', label: 'Exam Quotation Number', type: 'text' },
  ];

  const facilitatorTable = formValues.facilitators.length > 0 ? (
    <table>
      <thead>
        <tr>
          <th>Facilitator</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {formValues.facilitators.map((f, i) => (
          <tr key={i}>
            <td>{f.label}</td>
            <td>{f.role}</td>
            <td>
              <button type="button" onClick={() => removeFacilitator(i)}>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : <p>No facilitators added yet.</p>;

  return (
    <>
    <FormModal
      title="Add Level"
      fields={fields}
      initialValues={formValues}
      onChange={setFormValues}
      onSubmit={handleSubmit}
      onAdd={() => setShowFacilitatorPopup(true)}
      onClose={onClose}
      extraActions={[
        {
          label: "+ Add Facilitator",
           onClick: () => setShowFacilitatorPopup(true),
          className: 'cancel'
        }
      ]}
      tableContent={
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <select
              value={selectedFacilitator?.value || ''}
              onChange={(e) =>
                setSelectedFacilitator({
                  value: e.target.value,
                  label: e.target.options[e.target.selectedIndex].text
                })
              }
            >
              <option value="">Select Facilitator</option>
              {facilitators.map(f => (
                <option key={f.uuid} value={f.uuid}>
                  {f.firstName} {f.lastName}
                </option>
              ))}
            </select>
            <select
              value={selectedRole?.value || ''}
              onChange={(e) =>
                setSelectedRole({
                  value: e.target.value,
                  label: e.target.options[e.target.selectedIndex].text
                })
              }
            >
              <option value="">Select Role</option>
              <option value="Theory Instructor">Theory Instructor</option>
              <option value="Practical Instructor">Practical Instructor</option>
            </select>
          </div>
          {facilitatorTable}
        </>
      }
    />
    {showFacilitatorPopup && (
        <FacilitatorPopup
          onClose={() => setShowFacilitatorPopup(false)}
          onAddFacilitator={addFacilitator}
          facilitators={facilitatorsList}
        />
      )}
      </>
  );
};

export default LevelAddPopUp;
