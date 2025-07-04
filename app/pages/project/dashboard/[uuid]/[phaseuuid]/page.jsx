"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/utils/axios";
import CardComponent from "@/app/components/card/cardComponents";
import AddCardModal from "@/app/components/card/addCard";
import styles from "@/app/styles/project/phases/cardCategory.module.css";

export default function PhaseDetailPage({ projectType }) {
  const { uuid, phaseuuid } = useParams();
  const router = useRouter();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add/Edit Card modals
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [showEditCardModal, setShowEditCardModal] = useState(false);

  // Fetch cards for this phase
  const fetchCards = async () => {
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
      console.error(err);
      setError("Error fetching cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [phaseuuid]);

  // Navigate to this card's costCategory page
  const handleView = (costCategoryId ) => {
    router.push(
      `/projects/${uuid}/${phaseuuid}/${costCategoryId}`
    );
  };

  // Card actions
  const handleDeleteCard = async (card) => {
    if (!confirm(`Delete "${card.title}"?`)) return;
    await api.delete(`/phases/${phaseuuid}/cards/${card.uuid}`);
    fetchCards();
  };
  const handleEditCard = (card) => {
    setEditCard(card);
    setShowEditCardModal(true);
  };

  const getTypeLabel = () => {
    switch (projectType) {
      case "Milestones": return "Milestone Detail";
      case "Work Package": return "Work Package Detail";
      case "Duration Years": return "Duration Year Detail";
      default: return "Phase Detail";
    }
  };

  return (
    <div className={styles.container}>
      <h1>{getTypeLabel()}</h1>

      <div style={{ display: "flex", justifyContent: "flex-end", margin: "1rem 0" }}>
        <button className={styles.addButton1} onClick={() => setShowAddCardModal(true)}>
          + Add Card
        </button>
      </div>

      {loading ? (
        <p>Loading cards…</p>
      ) : error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : cards.length === 0 ? (
        <p>No cards available.</p>
      ) : (
        <div className="card-grid" style={{ display: "grid", gap: "1rem" }}>
          {cards.map((card) => (
            <CardComponent
              key={card.uuid}
              title={card.title}
              details={{}}
              onCardClick={() => handleView(card.uuid)}
              onUpdate={() => handleEditCard(card)}
              onDelete={() => handleDeleteCard(card)}
            />
          ))}
        </div>
      )}

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onAdded={() => {
          fetchCards();
          setShowAddCardModal(false);
        }}
        phaseUuid={phaseuuid}
      />

      {/* Edit Card Modal */}
      {showEditCardModal && (
        <AddCardModal
          isOpen={showEditCardModal}
          onClose={() => {
            setShowEditCardModal(false);
            setEditCard(null);
          }}
          onAdded={() => {
            fetchCards();
            setShowEditCardModal(false);
            setEditCard(null);
          }}
          phaseUuid={phaseuuid}
          editData={editCard}
        />
      )}
    </div>
  );
}
