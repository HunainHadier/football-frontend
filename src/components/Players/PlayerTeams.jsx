import React, { useEffect, useMemo, useState } from "react";
import { FiEye, FiSearch, FiUsers, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Table from "@/components/shared/table/Table";
import { getToken } from "@/utils/auth";

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const TeamsTable = () => {
  const [teams, setTeams] = useState([]);
  const [teamStatsStatus, setTeamStatsStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const token = getToken();

  // 👉 Load logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role; // "ADMIN", "COACH"

  // --- Fetch Teams ---
  const fetchTeams = async () => {
    setLoading(true);

    try {
      const role = localStorage.getItem("role");

      const apiURL =
        role === "ADMIN"
          ? `${BASE_URL}/api/coach/players/admin/all-coach-teams`
          : `${BASE_URL}/api/coach/players/teams`;

      const res = await fetch(apiURL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      setTeams(json.data || []);

      checkAllTeamsStats(json.data || []);
    } catch (err) {
      console.error("Fetch teams error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Check stats for all teams ---
  const checkAllTeamsStats = async (teamsList) => {
    const statsStatus = {};

    const promises = teamsList.map(async (team) => {
      try {
        const token = localStorage.getItem("authToken");

        const res = await fetch(
          `${BASE_URL}/api/stats/average/${team.team_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const json = await res.json();

        const matches =
          json.success &&
            json.team &&
            json.team.matches !== undefined
            ? Number(json.team.matches)
            : 0;

        statsStatus[team.team_id] = {
          hasStats: matches > 0,
          matches,
        };
      } catch (err) {
        statsStatus[team.team_id] = {
          hasStats: false,
          matches: 0,
        };
      }
    });

    await Promise.all(promises);
    setTeamStatsStatus(statsStatus);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // --- Filtered Teams for Search ---
  const filteredTeams = useMemo(() => {
    const q = search.toLowerCase();
    return teams.filter((t) => t.team_name.toLowerCase().includes(q));
  }, [teams, search]);

  // --- Table Columns ---
  const columns = [
    {
      id: "sno",
      header: "S.No",
      size: 80,
      cell: ({ row }) => (
        <div className="text-center">
          <strong>{row.index + 1}</strong>
        </div>
      ),
    },
    {
      id: "team_name",
      header: "Team Name",
      accessorKey: "team_name",
      size: 300,
      cell: ({ getValue }) => (
        <div className="fw-semibold text-dark">{getValue()}</div>
      ),
    },
    {
      id: "matches",
      header: "Total Matches",
      size: 120,
      cell: ({ row }) => {
        const teamId = row.original.team_id;
        const stats = teamStatsStatus[teamId];

        if (!stats) return <span>Loading...</span>;

        return (
          <div className="text-center fw-semibold">{stats.matches}</div>
        );
      },
    },
    {
      id: "created",
      header: "Created Date",
      accessorKey: "created_at",
      size: 180,
      cell: ({ getValue }) => (
        <div className="text-muted">
          {new Date(getValue()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },

    // --- ACTION BUTTONS ---
    {
      id: "actions",
      header: () => (
        <div className="text-center w-100 fw-semibold">Actions</div>
      ),
      size: 300,
      cell: ({ row }) => {
        const teamId = row.original.team_id;
        const stats = teamStatsStatus[teamId];

        return (
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-sm btn-primary d-flex align-items-center gap-2 px-3"
              onClick={() =>
                navigate(`/team/players/${teamId}`, {
                  state: { teamName: row.original.team_name },
                })
              }
            >
              <FiEye size={14} />
              View Players
            </button>

            {!stats ? (
              <button className="btn btn-sm btn-success d-flex align-items-center gap-2 px-3">
                <div className="spinner-border spinner-border-sm" />
                Loading...
              </button>
            ) : stats.hasStats ? (
              <button
                className="btn btn-sm btn-success d-flex align-items-center gap-2 px-3"
                onClick={() => navigate(`/team-comparison/${teamId}`)}
              >
                <FiEye size={14} />
                View Stats
              </button>
            ) : (
              // 👉 Hide Add Stats if ADMIN
              userRole !== "ADMIN" && (
                <button
                  className="btn btn-sm btn-success d-flex align-items-center gap-2 px-3"
                  onClick={() => navigate(`/teamstats/${teamId}`)}
                >
                  <FiPlus size={14} />
                  Add Stats
                </button>
              )
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Teams Management</h3>
          <p className="text-muted mb-0">
            Manage and view all your teams
          </p>
        </div>
        <span className="badge bg-primary bg-opacity-10 text-white px-3 py-2">
          {teams.length} {teams.length === 1 ? "Team" : "Teams"}
        </span>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <FiSearch className="text-muted" />
            </span>
            <input
              className="form-control border-start-0"
              placeholder="Search teams by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <Table
            data={filteredTeams}
            columns={columns}
            loading={loading}
            pageSize={10}
            emptyMessage={
              <div className="text-center py-5">
                <FiUsers size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No teams found</h5>
                <p className="text-muted">
                  {search
                    ? "Try changing your search terms"
                    : "Create your first team to get started"}
                </p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TeamsTable;
