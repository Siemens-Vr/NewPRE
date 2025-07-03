"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/utils/axios";
import AddCardModal from "@/app/components/card/addCard";
import CardComponent from "@/app/components/card/cardComponents";
import styles from "@/app/styles/project/phases/cardCategory.module.css";

export default function PhaseDetailPage({ projectType }) {
  const { phaseuuid, uuid, costCategoryId } = useParams();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // For editing card
  const [editCard, setEditCard] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const getTypeLabel = () => {
    switch (projectType) {
      case "Milestones":
        return "Milestone Detail";
      case "Work Package":
        return "Work Package Detail";
      case "Duration Years":
        return "Duration Year Detail";
      default:
        return "Phase Detail";
    }
  };

  // Fetch cards
  const fetchCards = async () => {
    if (!phaseuuid) return;
    setLoading(true);
    try {
      const res = await api.get(`/cost_categories/${phaseuuid}`);
      if (res.status === 200) {
        setCards(res.data);
        setError(null);
      } else {
        setError("Failed to fetch cards");
      }
    } catch (err) {
      setError("Error fetching cards");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [phaseuuid]);

  // Delete card handler
  const handleDeleteCard = async (card) => {
    if (!confirm(`Are you sure you want to delete "${card.name}"?`)) return;

    try {
      const res = await api.delete(`/phases/${phaseuuid}/cards/${card.uuid}`);
      if (res.status === 200) {
        fetchCards();
      } else {
        alert("Failed to delete card");
      }
    } catch (err) {
      alert("Error deleting card");
      console.error(err);
    }
  };

  // Update card handler (opens modal)
  const handleUpdateCard = (card) => {
    setEditCard(card);
    setShowEditModal(true);
  };

  return (
    <div className={styles.container}>
      <h1>{getTypeLabel()}: {phaseuuid}</h1>

      {/* Add Card Button Top Right */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
          onClick={() => setShowAddModal(true)}
          className={styles.addButton1}
        >
          + Add Card
        </button>
      </div>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={() => {
          fetchCards();
          setShowAddModal(false);
        }}
        phaseUuid={phaseuuid}
      />

      {/* Edit Card Modal (reuse AddCardModal with editData prop if you have it) */}
      {showEditModal && (
        <AddCardModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditCard(null);
          }}
          onAdded={() => {
            fetchCards();
            setShowEditModal(false);
            setEditCard(null);
          }}
          phaseUuid={phaseuuid}
          editData={editCard}
        />
      )}

      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Cards List */}
      {loading ? (
        <p>Loading cards...</p>
      ) : cards.length === 0 ? (
        <p>No cards added yet.</p>
      ) : (
        <div className="card-grid">
          {cards.map((card, index) => {
            // console.log(card, "Card UUID");
            const costCategoryUrl = `/projects/${uuid}/${phaseuuid}/${card.id}`;
 
            return (
                 <CardComponent
      key={card.uuid}
      title={card.title}
      details={{}}
      href={costCategoryUrl}
      onUpdate={() => handleUpdateCard(card)}
      onDelete={() => handleDeleteCard(card)}
    />
            );
          })}
        </div>
      )}
    </div>
  );
}

