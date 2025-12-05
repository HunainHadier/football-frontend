import React, { useEffect, useState, useMemo } from 'react';
import Table from '@/components/shared/table/Table';
import { FiMoreHorizontal, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Dropdown from '@/components/shared/Dropdown';
import { useNavigate } from 'react-router-dom';
import { getToken } from '@/utils/auth';
import topTost from '@/utils/topTost';

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const MatchTable = ({ title = "Matches", mode = "coach-manage" }) => {
  const isCoachManage = mode === "coach-manage";
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const coachId = user?.id;

  const [form, setForm] = useState({
    m_name: "",
    m_venue: "",
    m_date: "",
    m_team1: "",
    m_team2: ""
  });

  const token = getToken();
  const navigate = useNavigate();

  const getMatchesApi = async () => {
    const response = await fetch(`${BASE_URL}/api/match`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch matches');
    return result;
  };

  const addMatchApi = async (payload) => {
    const response = await fetch(`${BASE_URL}/api/match`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to add match');
    return result;
  };

  const updateMatchApi = async (id, payload) => {
    const response = await fetch(`${BASE_URL}/api/match/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update match');
    return result;
  };

  const deleteMatchApi = async (id) => {
    const response = await fetch(`${BASE_URL}/api/match/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to delete match');
    return result;
  };

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await getMatchesApi();
      setMatches(data.matches || data || []);
    } catch (err) {
      topTost(err.message || 'Failed to load matches', 'error');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return matches;

    const query = searchQuery.toLowerCase();
    return matches.filter((match) =>
      (match.m_name || "").toLowerCase().includes(query) ||
      (match.m_venue || "").toLowerCase().includes(query) ||
      (match.m_team1 || "").toLowerCase().includes(query) ||
      (match.m_team2 || "").toLowerCase().includes(query)
    );
  }, [matches, searchQuery]);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      m_name: "",
      m_venue: "",
      m_date: "",
      m_team1: "",
      m_team2: ""
    });
    setShowModal(true);
  };

  const openEditModal = (match) => {
    setEditingId(match.m_id || match.id);
    setForm({
      m_name: match.m_name,
      m_venue: match.m_venue,
      m_date: match.m_date?.split("T")[0] || "",
      m_team1: match.m_team1,
      m_team2: match.m_team2,
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (!form.m_name || !form.m_venue || !form.m_date || !form.m_team1 || !form.m_team2) {
        topTost("All fields are required", "error");
        return;
      }

      const payload = {
        ...form,
        ...(editingId ? {} : { m_added_by: coachId }),
      };

      if (editingId) {
        await updateMatchApi(editingId, payload);
        topTost("Match updated successfully", "success");
      } else {
        await addMatchApi(payload);
        topTost("Match added successfully", "success");
      }

      setShowModal(false);
      loadMatches();
    } catch (err) {
      topTost(err.message || "Failed to save match", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMatch = async (id) => {
    if (!window.confirm("Delete this match?")) return;

    try {
      setDeletingId(id);
      await deleteMatchApi(id);
      topTost("Match deleted", "success");
      loadMatches();
    } catch (err) {
      topTost(err.message || "Failed to delete match", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ------------------------------
  // TABLE COLUMNS - UPDATED
  // ------------------------------
  const columns = [
    {
      header: "S.No",
      size: 60,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },

    // MATCH NAME ONLY — venue/date removed
    {
      accessorKey: "name",
      header: "Match",
      size: 200,
      cell: (info) => {
        const match = info.row.original;
        return (
          <div className="fw-semibold">
            {match.m_name}
          </div>
        );
      },
    },

    // VENUE COLUMN
    {
      accessorKey: "venue",
      header: "Venue",
      size: 150,
      cell: (info) => (
        <span className="badge bg-light text-dark border">
          {info.row.original.m_venue || "-"}
        </span>
      ),
    },

    // DATE COLUMN
    {
      accessorKey: "date",
      header: "Date",
      size: 120,
      cell: (info) => (
        <span className="badge bg-light text-dark border">
          {formatDate(info.row.original.m_date)}
        </span>
      ),
    },

    // TEAMS COLUMN
    {
      header: "Teams",
      size: 180,
      cell: ({ row }) => {
        const match = row.original;
        return (
          <div className="d-flex flex-column gap-1">
            <span className="badge bg-primary-subtle text-primary">
              {match.m_team1}
            </span>
            <span className="badge bg-danger-subtle text-danger">
              {match.m_team2}
            </span>
          </div>
        );
      },
    },
  ];

  // ACTIONS COLUMN FOR COACH
  if (isCoachManage) {
    columns.push({
      header: "Actions",
      size: 120,
      cell: ({ row }) => {
        const match = row.original;
        const id = match.m_id;

        return (
          <div className="d-flex justify-content-end">
            <Dropdown
              dropdownItems={[
                {
                  label: "Edit",
                  icon: <FiEdit size={14} className="me-2" />,
                  onClick: () => openEditModal(match),
                },
                {
                  label: "Delete",
                  icon: <FiTrash2 size={14} className="me-2" />,
                  onClick: () => handleDeleteMatch(id),
                  className: "text-danger",
                },
              ]}
              triggerClass="btn btn-sm btn-outline-secondary"
              triggerIcon={<FiMoreHorizontal size={16} />}
            />
          </div>
        );
      },
    });
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="h3 mb-1">{title}</h1>
          <p className="text-muted">Upcoming fixtures, venues and details.</p>
        </div>

        {isCoachManage && (
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAddModal}>
            <FiPlus size={16} />
            Add Match
          </button>
        )}
      </div>

      <div className="card p-3 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <Table
            data={filteredMatches}
            columns={columns}
            loading={loading}
            enablePagination={true}
            pageSize={10}
            emptyMessage="No matches found"
          />
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingId ? "Edit Match" : "Add Match"}
                  </h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label>Match Name</label>
                      <input
                        name="m_name"
                        className="form-control"
                        value={form.m_name}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label>Venue</label>
                      <input
                        name="m_venue"
                        className="form-control"
                        value={form.m_venue}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label>Date</label>
                      <input
                        type="date"
                        name="m_date"
                        className="form-control"
                        value={form.m_date}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label>Team 1</label>
                      <input
                        name="m_team1"
                        className="form-control"
                        value={form.m_team1}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label>Team 2</label>
                      <input
                        name="m_team2"
                        className="form-control"
                        value={form.m_team2}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-light"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : editingId ? "Update Match" : "Add Match"}
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

export default MatchTable;
