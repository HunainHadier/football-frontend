// ========================= 
// PlayersTable.jsx (FINAL FIXED VERSION WITH BULK API)
// =========================

import React, { useEffect, useState, useMemo } from "react";
import {
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiUser,
  FiSearch,
  FiSend,
  FiUsers,
} from "react-icons/fi";

import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/utils/auth";
import topTost from "../../utils/topTost";


const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const PlayersTable = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamModal, setTeamModal] = useState(false);
  const [teamName, setTeamName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sending, setSending] = useState(false);


  const [form, setForm] = useState({ name: "", age: "", email: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const token = getToken();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = (user?.role || "").toLowerCase();

  // -------------------------
  // FETCH PLAYERS
  // -------------------------
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const apiUrl =
        role === "admin"
          ? `${BASE_URL}/api/admin/players`
          : `${BASE_URL}/api/coach/players`;

      const res = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setPlayers(data.data || data || []);
    } catch (err) {
      console.log("Error:", err);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // -------------------------
  // MULTI SELECT - WITH TEAM VALIDATION
  // -------------------------
  const togglePlayer = (player) => {
    // Players with teams can still be selected for evaluation
    // Only prevent selection for team creation
    setSelectedPlayers((prev) =>
      prev.includes(player.p_id)
        ? prev.filter((x) => x !== player.p_id)
        : [...prev, player.p_id]
    );
  };

  // Check if any selected player already has a team (for team creation)
  const hasPlayersWithTeams = useMemo(() => {
    return selectedPlayers.some(playerId => {
      const player = players.find(p => p.p_id === playerId);
      return player && player.team_name && player.team_name !== "No Team";
    });
  }, [selectedPlayers, players]);

  // Get selected players with teams info
  const getSelectedPlayersInfo = useMemo(() => {
    return selectedPlayers.map(playerId => {
      const player = players.find(p => p.p_id === playerId);
      return player;
    }).filter(Boolean);
  }, [selectedPlayers, players]);

  // -------------------------
  // CREATE TEAM
  // -------------------------
  const createTeam = async () => {
    if (!teamName.trim()) return alert("Team name required");
    if (selectedPlayers.length === 0) return alert("Select at least 1 player");

    // Double check - ensure no selected players have teams
    const playersWithTeams = selectedPlayers.filter(playerId => {
      const player = players.find(p => p.p_id === playerId);
      return player && player.team_name && player.team_name !== "No Team";
    });

    if (playersWithTeams.length > 0) {
      alert("Some selected players are already in teams. Please remove them from selection.");
      return;
    }

    try {
      // CREATE TEAM
      const res = await fetch(`${BASE_URL}/api/coach/players/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_name: teamName,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      const newTeamId = json.team_id;

      // ASSIGN PLAYERS
      await fetch(`${BASE_URL}/api/coach/players/teams/assign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_id: newTeamId,
          player_ids: selectedPlayers,
        }),
      });

      alert("Team created successfully!");
      setTeamModal(false);
      setTeamName("");
      setSelectedPlayers([]);

      fetchPlayers();
    } catch (err) {
      alert(err.message);
    }
  };


  // const sendEvaluation = async (player_id = null) => {
  //   const playerIds = player_id ? [player_id] : selectedPlayers;

  //   if (playerIds.length === 0) {
  //     return alert("Please select at least one player");
  //   }

  //   try {
  //     setSending(true);   // <-- START LOADING

  //     let result;

  //     if (player_id) {
  //       const res = await fetch(`${BASE_URL}/api/coach/players/send-evaluation`, {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ player_id }),
  //       });

  //       result = await res.json();
  //       if (!res.ok) throw new Error(result.message);

  //       alert(`Evaluation email sent successfully to ${result.email}`);
  //     } else {
  //       const res = await fetch(`${BASE_URL}/api/coach/players/send-bulk-evaluation`, {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ player_ids: playerIds }),
  //       });

  //       result = await res.json();
  //       if (!res.ok) throw new Error(result.message);

  //     }

  //   } catch (err) {
  //     alert("Error: " + err.message);
  //   } finally {
  //     setSending(false);  // <-- STOP LOADING
  //   }
  // };



  // -------------------------
  // CRUD MODAL
  // -------------------------

  const sendEvaluation = async (player_id = null) => {
    const playerIds = player_id ? [player_id] : selectedPlayers;

    if (playerIds.length === 0) {
      return alert("Please select at least one player");
    }

    try {
      setSending(true);

      let result;

      if (player_id) {
        // SINGLE
        const res = await fetch(`${BASE_URL}/api/coach/players/send-evaluation`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ player_id }),
        });

        result = await res.json();
        if (!res.ok) throw new Error(result.message);

        // 🔥 TOAST HERE
        topTost("Successfully Sent");

      } else {
        // BULK
        const res = await fetch(`${BASE_URL}/api/coach/players/send-bulk-evaluation`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ player_ids: playerIds }),
        });

        result = await res.json();
        if (!res.ok) throw new Error(result.message);

        // 🔥 TOAST HERE
        if (result.sent > 0) {
          topTost(`Successfully sent to ${result.sent} player(s)`);
        }
      }

    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSending(false);
    }
  };




  const openCreateModal = () => {
    setEditingId(null);
    setForm({ name: "", age: "", email: "" });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.p_id);
    setForm({
      name: p.p_name,
      age: p.p_age || "",
      email: p.p_email || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Name required");
    if (!form.email.trim()) return setError("Email required");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      age: form.age ? Number(form.age) : null,
    };

    try {
      setSaving(true);

      const url = editingId
        ? `${BASE_URL}/api/coach/players/${editingId}`
        : `${BASE_URL}/api/coach/players`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      setShowModal(false);
      fetchPlayers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------
  // SEARCH
  // -------------------------
  const filteredPlayers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return players.filter((p) =>
      (p.p_name || "").toLowerCase().includes(q)
    );
  }, [players, searchQuery]);

  // -------------------------
  // TABLE COLUMNS
  // -------------------------
  // Assume 'role' is passed or available in the scope where 'columns' is defined
  // For Admin API, the role is typically 'ADMIN'
  // For Coach API, the role is typically 'coach'

  const columns = [
    // --- 1. Conditional Checkbox Column ---
    ...(role === "coach" ? [{
      id: "select",
      header: "",
      size: 40,
      cell: ({ row }) => {
        const p = row.original;

        return (
          <input
            type="checkbox"
            checked={selectedPlayers.includes(p.p_id)}
            onChange={() => togglePlayer(p)}
            title="Select player for evaluation or team creation"
          />
        );
      },
    }] : []), // Agar role 'coach' nahi hai (jaise 'ADMIN' hai), toh ye column skip ho jayega

    // ------------------------------------

    {
      id: "sno",
      header: "S.No",
      size: 50,
      cell: ({ row }) => <strong>{row.index + 1}</strong>,
    },

    {
      id: "team",
      header: "Team",
      size: 200,
      cell: ({ row }) => {
        const p = row.original;
        const hasTeam = p.team_name && p.team_name !== "No Team";

        return (
          <span
            className={`badge px-3 py-2 ${hasTeam ? 'bg-success text-white' : 'bg-secondary text-white'}`}
            title={hasTeam ? `Player is in team: ${p.team_name}` : "Player not in any team"}
          >
            {p.team_name || "No Team"}
          </span>
        );
      },
    },

    {
      id: "name",
      header: "Name",
      size: 250,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
              style={{ width: 38, height: 38 }}
            >
              <FiUser className="text-primary" />
            </div>
            <div className="fw-semibold">{p.p_name}</div>
          </div>
        );
      },
    },

    {
      id: "email",
      header: "Email",
      size: 200,
      accessorKey: "p_email",
      cell: ({ getValue }) => getValue() || "-",
    },

    {
      id: "age",
      header: "Age",
      accessorKey: "p_age",
      size: 60,
      cell: ({ getValue }) => (
        <span className="badge bg-light text-dark px-3 py-2">
          {getValue() || "-"}
        </span>
      ),
    },

    {
      id: "created",
      header: "Created",
      accessorKey: "created_at",
      size: 150,
      cell: ({ getValue }) =>
        new Date(getValue()).toLocaleDateString(),
    },

    {
      id: "actions",
      header: "Actions",
      size: 120,
      cell: ({ row }) => {
        const p = row.original;

        return (
          <Dropdown
            triggerClass="btn btn-sm btn-outline-secondary"
            triggerIcon={<FiMoreHorizontal />}
            dropdownItems={[
              {
                label: "View Profile",
                icon: <FiUsers />,
                onClick: () => navigate(`/player/profile/${p.p_id}`),
              },
              ...(role === "coach"
                ? [
                  {
                    label: "Edit",
                    icon: <FiEdit />,
                    onClick: () => openEditModal(p),
                  },
                ]
                : []),
            ]}
          />
        );
      },
    },

  ];

  return (
    <div className="container-fluid py-4">

      {/* ---------------- HEADER ---------------- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Players Management</h3>

        <div className="d-flex gap-2">
          {/* MULTIPLE EVALUATION BUTTON - Shows for any selected players */}
          {selectedPlayers.length > 0 && (
            <button
              className="btn btn-info text-white d-flex align-items-center gap-2"
              onClick={() => sendEvaluation()}
              disabled={sending}  // <-- disable during sending
              title="Send evaluation emails to all selected players"
            >
              {sending ? (
                <>
                  <div className="spinner-border spinner-border-sm"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FiSend /> Generate Traits ({selectedPlayers.length})
                </>
              )}
            </button>
          )}


          {/* CREATE TEAM BUTTON - Only show if no selected players have teams */}
          {selectedPlayers.length > 0 && !hasPlayersWithTeams && (
            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={() => setTeamModal(true)}
              title="Create new team with selected players"
            >
              <FiUsers /> Create Team ({selectedPlayers.length})
            </button>
          )}

          {role === "coach" && (
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={openCreateModal}
            >
              <FiUser /> Add Player
            </button>
          )}
        </div>
      </div>

      {/* ---------------- SELECTION INFO ---------------- */}
      {selectedPlayers.length > 0 && (
        <div className="alert alert-info mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{selectedPlayers.length} player(s) selected</strong>
              {hasPlayersWithTeams && (
                <span className="text-warning ms-2">
                  - Note: Players with teams can still receive evaluations but cannot be added to new teams
                </span>
              )}
            </div>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSelectedPlayers([])}
            >
              Clear Selection
            </button>
          </div>

          {/* Show selected players summary */}
          {getSelectedPlayersInfo.length > 0 && (
            <div className="mt-2 small">
              <strong>Selected:</strong> {getSelectedPlayersInfo.map(p => p.p_name).join(', ')}
            </div>
          )}
        </div>
      )}

      {/* ---------------- SEARCH ---------------- */}
      <div className="card mb-3 p-3">
        <div className="input-group">
          <span className="input-group-text bg-light">
            <FiSearch />
          </span>
          <input
            className="form-control"
            placeholder="Search player..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <Table data={filteredPlayers} columns={columns} loading={loading} />
        </div>
      </div>

      {/* ---------------- CREATE TEAM MODAL ---------------- */}
      {teamModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 5000 }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ width: 380 }}>
            <h5 className="fw-bold mb-3">Create New Team</h5>

            <input
              className="form-control mb-3"
              placeholder="Enter Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <div className="mb-3">
              <strong>Selected Players: {selectedPlayers.length}</strong>
              <div className="small text-muted mt-1">
                {getSelectedPlayersInfo.map(p => p.p_name).join(', ')}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-light"
                onClick={() => setTeamModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={createTeam}>
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- ADD / EDIT PLAYER MODAL ---------------- */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">
                    {editingId ? "Edit Player" : "Add Player"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}

                  <label className="form-label fw-semibold">Name</label>
                  <input
                    className="form-control mb-3"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />

                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}

                  />

                  <label className="form-label fw-semibold">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.age}
                    onChange={(e) =>
                      setForm({ ...form, age: e.target.value })
                    }
                  />
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit">
                    {editingId ? "Update Player" : "Add Player"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersTable;