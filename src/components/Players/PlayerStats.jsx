import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const AddPlayerStats = () => {
  const { id: playerId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const [form, setForm] = useState({
    matches: "",
    goals: "",
    assists: "",
    shots: "",
    shots_on_goal: "",
    big_chances: "",
    key_passes: "",
    tackles: "",
    pass_completion_pct: "",
    minutes: "",
    ejections: "",
    cautions: "",
    progressive_carries: "",
    defensive_actions: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitStats = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(
        `${BASE_URL}/api/coach/stats/add/${playerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Failed to save stats");
        setSaving(false);
        return;
      }

      alert("Player stats saved successfully");
      navigate(`/player/profile/${playerId}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // FIELD LABELS + DESCRIPTION
  const fields = [
    {
      name: "matches",
      label: "Matches (M)",
      desc: "Total matches played during a year.",
    },
    {
      name: "goals",
      label: "Goals (G)",
      desc: "Total number of goals scored by a player during a Match.",
    },
    {
      name: "assists",
      label: "Assists (A)",
      desc: "Passes that directly lead to a goal scored in a Match.",
    },
    {
      name: "shots",
      label: "Shots (Sh)",
      desc: "Total attempts to score (shots on target + shots that miss).",
    },
    {
      name: "shots_on_goal",
      label: "Shots On Goal (SOG)",
      desc: "Shots that were on target and would score unless saved.",
    },
    {
      name: "big_chances",
      label: "Big Chances",
      desc: "High-quality scoring situations including penalties.",
    },
    {
      name: "key_passes",
      label: "Key Passes",
      desc: "Passes that lead directly to a shot on goal.",
    },
    {
      name: "tackles",
      label: "Tackles",
      desc: "Attempts to win the ball (won or lost) in a match.",
    },
    {
      name: "pass_completion",
      label: "Pass Completion (%)",
      desc: "Successful passes divided by total passes attempted.",
    },
    {
      name: "ejections",
      label: "Ejections (Red Cards)",
      desc: "Number of red cards received by the player in a match.",
    },

    {
      name: "minutes_played",
      label: "Minutes Played (MIN)",
      desc: "Total time spent on the field during matches.",
    },
    {
      name: "cautions",
      label: "Cautions & Ejections",
      desc: "Yellow and red cards received during a match.",
    },
    {
      name: "progressive_carries",
      label: "Progressive Carries",
      desc: "Carries progressing the ball forward more than 5 meters.",
    },
    {
      name: "defensive_actions",
      label: "Defensive Actions",
      desc: "Tackles, interceptions, and blocks made by the player.",
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Add Player Statistics</h3>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <form className="card p-4 shadow-sm" onSubmit={submitStats}>
        <div className="row g-4">

          {fields.map((f) => (
            <div className="col-md-6" key={f.name}>
              <label className="form-label fw-bold">{f.label}</label>
              <input
                type="number"
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                required
                className="form-control"
              />
              <small className="text-muted">{f.desc}</small>
            </div>
          ))}

        </div>

        <div className="text-end mt-4">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Stats"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlayerStats;
