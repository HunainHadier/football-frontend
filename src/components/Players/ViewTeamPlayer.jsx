import React, { useEffect, useState, useMemo } from "react";
import { FiArrowLeft, FiUser, FiUsers, FiSearch, FiMoreHorizontal, FiEdit, FiTrash2 } from "react-icons/fi";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getToken } from "@/utils/auth";

import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const TeamPlayersPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("");

  // Add More Player States
  const [showModal, setShowModal] = useState(false);
  const [unassignedPlayers, setUnassignedPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");

  const token = getToken();
  
  // LocalStorage se role get karna
  const getUserRole = () => {
    try {
      // Pehle localStorage se 'role' check karo
      const roleFromStorage = localStorage.getItem('role');
      if (roleFromStorage) {
        return roleFromStorage.toUpperCase();
      }
      
      // Agar role nahi mila toh user object se check karo
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        const user = JSON.parse(userFromStorage);
        return user.role ? user.role.toUpperCase() : null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting role from localStorage:', error);
      return null;
    }
  };

  const userRole = getUserRole();
  
  // Check if user is admin
  const isAdmin = userRole === "ADMIN";

  // Fetch Team Players
  const fetchTeamPlayers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/coach/players/teams/${teamId}/players`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const json = await res.json();
      
      // YEH LINE FIX KARO - data array ko set karo
      if (json && json.data && Array.isArray(json.data)) {
        setPlayers(json.data);
      } else if (Array.isArray(json)) {
        setPlayers(json);
      } else {
        console.error("Unexpected API response format:", json);
        setPlayers([]);
      }

      if (location.state?.teamName) {
        setTeamName(location.state.teamName);
      } else {
        const teamRes = await fetch(`${BASE_URL}/api/coach/players/teams`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teams = await teamRes.json();
        const currentTeam = teams.find((t) => t.team_id == teamId);
        if (currentTeam) setTeamName(currentTeam.team_name);
      }
    } catch (err) {
      console.error("Fetch players error:", err);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) fetchTeamPlayers();
  }, [teamId]);

  // Fetch Unassigned Players (for Add More)
  const fetchUnassignedPlayers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/coach/players/unassigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      
      // YEH BHI FIX KARO
      if (json && json.data && Array.isArray(json.data)) {
        setUnassignedPlayers(json.data);
      } else if (Array.isArray(json)) {
        setUnassignedPlayers(json);
      } else {
        console.error("Unexpected unassigned players API response:", json);
        setUnassignedPlayers([]);
      }
    } catch (err) {
      console.error("Unassigned fetch error:", err);
      setUnassignedPlayers([]);
    }
  };

  // Load unassigned players when modal opens
  useEffect(() => {
    if (showModal) fetchUnassignedPlayers();
  }, [showModal]);

  // Assign Selected Players
  const assignPlayers = async () => {
    if (selectedPlayers.length === 0)
      return alert("Select at least one player");

    try {
      const res = await fetch(`${BASE_URL}/api/coach/players/teams/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          team_id: teamId,
          player_ids: selectedPlayers,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setShowModal(false);
        setSelectedPlayers([]);
        fetchTeamPlayers();
      }
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  // Remove Player From Team
const unassignPlayer = async (player_id) => {
  if (!player_id) return alert("Player ID missing");

  try {
    const res = await fetch(`${BASE_URL}/api/coach/players/team/unassign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        player_ids: [player_id], // <-- FIXED: array bhejna zaroori hai
      }),
    });

    const json = await res.json();

    if (json.success) {
      alert("Player removed from team successfully");
      fetchTeamPlayers();
    } else {
      alert("Error: " + json.message);
    }
  } catch (err) {
    console.error("Unassign Error:", err);
    alert("Something went wrong while removing player");
  }
};


  // Search functionality - AB YE SAFE HAI
  const filteredPlayers = useMemo(() => {
    if (!Array.isArray(players)) return [];
    
    const q = searchQuery.toLowerCase();
    return players.filter((p) =>
      (p.p_name || "").toLowerCase().includes(q) ||
      (p.p_email || "").toLowerCase().includes(q)
    );
  }, [players, searchQuery]);

  const goBack = () => navigate(-1);

  // Send Evaluation
  const sendEvaluation = async (player_id) => {
    if (!player_id) return alert("Player ID missing");

    try {
      const res = await fetch(`${BASE_URL}/api/coach/players/send-evaluation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      alert(`Success: Evaluation email sent to ${json.email}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Table Columns Definition
  const columns = [
  {
    id: "sno",
    header: "S.No",
    size: 50,
    cell: ({ row }) => <strong>{row.index + 1}</strong>,
  },
  {
    id: "name",
    header: "Player Name",
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
          <div>
            <span className="fw-semibold">{p.p_name}</span>
            {p.position && (
              <small className="text-muted d-block">{p.position}</small>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "p_email",
    size: 200,
    cell: ({ getValue }) => getValue() || "-",
  },
  {
    id: "age",
    header: "Age",
    accessorKey: "p_age",
    size: 80,
    cell: ({ getValue }) => (
      <span className="badge bg-light text-dark px-3 py-2">
        {getValue() || "-"}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    size: 100,
    cell: () => (
      <span className="badge bg-success bg-opacity-10 text-success px-2 py-1">
        Active
      </span>
    ),
  },
{
  id: "actions",
  header: "Actions",
  size: 120,
  cell: ({ row }) => {
    const p = row.original;
    const userRole = localStorage.getItem("role");

    const baseItems = [
      {
        label: "View Profile",
        icon: <FiUsers />,
        onClick: () => navigate(`/player/profile/${p.p_id}`),
      },
    ];

    const coachOnlyItems = [
      {
        label: "Remove from Team",
        icon: <FiTrash2 />,
        className: "text-danger",
        onClick: () => unassignPlayer(p.p_id),
      },
    ];

    const dropdownItems =
      userRole === "ADMIN" ? baseItems : [...baseItems, ...coachOnlyItems];

    return (
      <Dropdown
        triggerClass="btn btn-sm btn-outline-secondary"
        triggerIcon={<FiMoreHorizontal />}
        dropdownItems={dropdownItems}
      />
    );
  },
},

];

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={goBack}
          >
            <FiArrowLeft size={16} />
            Back
          </button>

          <div>
            <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <FiUsers className="text-primary" />
              {teamName}
            </h3>
            <p className="text-muted mb-0">Team player list</p>
          </div>
        </div>

        {/* ADMIN KE LIYE BUTTON HIDE */}
        {!isAdmin && (
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <FiUsers /> Add More Players
          </button>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="card mb-3 p-3">
        <div className="input-group">
          <span className="input-group-text bg-light">
            <FiSearch />
          </span>
          <input
            className="form-control"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {!Array.isArray(players) || players.length === 0 ? (
            <div className="text-center py-5">
              <FiUser size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No players found</h5>
              <p className="text-muted">Add players to this team to get started</p>
            </div>
          ) : (
            <Table 
              data={filteredPlayers} 
              columns={columns} 
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* ADD MORE PLAYERS MODAL - ADMIN KE LIYE HIDE */}
      {showModal && !isAdmin && (
        <div className="modal fade show d-block" style={{ background: "#00000070" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Add Players to Team</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                {!Array.isArray(unassignedPlayers) || unassignedPlayers.length === 0 ? (
                  <div className="text-center py-4">
                    <FiUser size={32} className="text-muted mb-2" />
                    <p className="text-muted">No unassigned players available.</p>
                  </div>
                ) : (
                  <ul className="list-group">
                    {unassignedPlayers.map((p) => (
                      <li
                        key={p.p_id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                            style={{ width: 36, height: 36 }}
                          >
                            <FiUser className="text-primary" size={16} />
                          </div>
                          <div>
                            <strong>{p.p_name}</strong>
                            <div className="text-muted small">{p.p_email}</div>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPlayers([...selectedPlayers, p.p_id]);
                            } else {
                              setSelectedPlayers(
                                selectedPlayers.filter((id) => id !== p.p_id)
                              );
                            }
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={assignPlayers}
                  disabled={selectedPlayers.length === 0}
                >
                  Add Selected ({selectedPlayers.length})
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPlayersPage;