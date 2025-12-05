import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const AddTeamStats = () => {
  const { id: teamId } = useParams();
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
    cautions: "",
    ejections: "",
    progressive_carries: "",
    defensive_actions: "",
  });

  const [saving, setSaving] = useState(false);

  // ---------------------------------
  // HANDLE INPUT CHANGE
  // ---------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // ---------------------------------
  // SUBMIT TEAM STATS
  // ---------------------------------
  const submitStats = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // convert empty fields to 0
      const cleanedData = {};
      for (let key in form) {
        cleanedData[key] = form[key] === "" ? 0 : Number(form[key]);
      }

      const res = await fetch(`${BASE_URL}/api/stats/add/${teamId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Failed to save team stats");
        setSaving(false);
        return;
      }

      alert("Team stats saved successfully");
      navigate(`/team/profile/${teamId}`);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------
  // TEAM INPUT FIELDS
  // ---------------------------------
  const fields = [
    { name: "matches", label: "Matches Played", desc: "Total matches played." },
    { name: "goals", label: "Goals Scored", desc: "Total team goals." },
    { name: "assists", label: "Assists", desc: "Total assists by team." },
    { name: "shots", label: "Shots", desc: "Total shots attempted." },
    { name: "shots_on_goal", label: "Shots on Goal", desc: "Shots on target." },
    { name: "big_chances", label: "Big Chances", desc: "High-quality chances." },
    { name: "key_passes", label: "Key Passes", desc: "Passes leading to shot attempts." },
    { name: "tackles", label: "Tackles", desc: "Total tackles made." },
    { name: "pass_completion_pct", label: "Pass Completion (%)", desc: "Successful pass percentage." },
    { name: "minutes", label: "Minutes Played", desc: "Total minutes played." },
    { name: "cautions", label: "Cautions", desc: "Yellow cards." },
    { name: "ejections", label: "Ejections", desc: "Red cards." },
    { name: "progressive_carries", label: "Progressive Carries", desc: "Forward ball carries." },
    { name: "defensive_actions", label: "Defensive Actions", desc: "Interceptions, blocks, tackles." },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Add Team Statistics</h3>
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
                className="form-control"
                required
              />
              <small className="text-muted">{f.desc}</small>
            </div>
          ))}
        </div>

        <div className="text-end mt-4">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Team Stats"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeamStats;
