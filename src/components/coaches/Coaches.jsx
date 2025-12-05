import React, { useEffect, useState, useMemo } from 'react';
import Table from '@/components/shared/table/Table';
import { FiMoreHorizontal, FiEdit, FiTrash2, FiPlus, FiMapPin, FiCalendar, FiUser } from 'react-icons/fi';
import Dropdown from '@/components/shared/Dropdown';
import { getToken } from '@/utils/auth';
import topTost from '@/utils/topTost';

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const CoachTable = ({ title = "Coaches", mode = "admin-manage" }) => {
  const isAdminManage = mode === "admin-manage";

  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    status: 1,
    region: ""
  });

  const token = getToken();

  // Fetch API functions
  const fetchCoachesApi = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/coaches`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch coaches');
    }
    return result;
  };

  const createCoachApi = async (payload) => {
    const response = await fetch(`${BASE_URL}/api/admin/coaches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create coach');
    }
    return result;
  };

  const updateCoachApi = async (id, payload) => {
    const response = await fetch(`${BASE_URL}/api/admin/coaches/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update coach');
    }
    return result;
  };

  // Load coaches
  const loadCoaches = async () => {
    try {
      setLoading(true);
      const data = await fetchCoachesApi();
      setCoaches(data.coaches || data || []);
    } catch (err) {
      console.error('Error loading coaches:', err);
      topTost(err.message || 'Failed to load coaches', 'error');
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoaches();
  }, []);

  // Filter coaches based on search and region
  const filteredCoaches = useMemo(() => {
    let filtered = coaches;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((coach) =>
        (coach.u_name || coach.name)?.toLowerCase().includes(query) ||
        (coach.u_username || coach.username)?.toLowerCase().includes(query) ||
        (coach.u_email || coach.email)?.toLowerCase().includes(query)
      );
    }

    // Apply region filter
    if (regionFilter !== 'all') {
      filtered = filtered.filter(coach =>
        (coach.u_region || coach.region) === regionFilter
      );
    }

    return filtered;
  }, [coaches, searchQuery, regionFilter]);

  // Open Add Modal
  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      status: 1,
      region: ""
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (coach) => {
    setEditingId(coach.u_id || coach.id);
    setForm({
      name: coach.u_name || coach.name,
      username: coach.u_username || coach.username,
      email: coach.u_email || coach.email,
      password: "",
      status: coach.u_status || coach.status,
      region: coach.u_region || coach.region || ""
    });
    setShowModal(true);
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle save (create/update)
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Validation
      if (!form.name.trim()) {
        topTost('Name is required', 'error');
        return;
      }
      if (!form.username.trim()) {
        topTost('Username is required', 'error');
        return;
      }
      if (!form.email.trim()) {
        topTost('Email is required', 'error');
        return;
      }
      if (!editingId && !form.password.trim()) {
        topTost('Password is required for new coaches', 'error');
        return;
      }
      if (!form.region) {
        topTost('Region is required', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        topTost('Please enter a valid email address', 'error');
        return;
      }

      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        status: form.status,
        region: form.region,
        ...(form.password.trim() && { password: form.password })
      };

      if (editingId) {
        await updateCoachApi(editingId, payload);
        topTost('Coach updated successfully', 'success');
      } else {
        await createCoachApi(payload);
        topTost('Coach created successfully', 'success');
      }

      setShowModal(false);
      loadCoaches(); // Refresh data
    } catch (err) {
      console.error('Error saving coach:', err);
      topTost(err.message || 'Failed to save coach', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      header: 'S.No',
      size: 60,
      cell: ({ row }) => (
        <div className="text-center">
          {row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Coach',
      size: 200,
      cell: (info) => {
        const coach = info.row.original;
        return (
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}>
              <FiUser className="text-primary" />
            </div>
            <div>
              <div className="fw-semibold">{coach.u_name || coach.name}</div>
              <div className="small text-muted">@{coach.u_username || coach.username}</div>
              <div className="d-md-none small text-muted">
                {coach.u_email || coach.email}
              </div>
              <div className="d-md-none small">
                Region: {coach.u_region || coach.region || '-'}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      size: 200,
      cell: (info) => {
        const coach = info.row.original;
        return (
          <div>
            <div className="fw-medium">@{coach.u_username || coach.username}</div>
            <div className="text-muted small">{coach.u_email || coach.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'u_region',
      header: 'Region',
      size: 120,
      cell: ({ row }) => {
        const coach = row.original;
        const region = coach.u_region ?? coach.region;

        return (
          <span className="badge bg-light text-dark border text-capitalize">
            {region || '-'}
          </span>
        );
      }
    },
    {
      accessorKey: 'u_status',
      header: 'Status',
      size: 100,
      cell: (info) => {
        const coach = info.row.original;
        const status = coach.u_status ?? coach.status;

        return status == 1 ? (
          <span className="badge bg-success bg-opacity-10 text-white" style={{ minWidth: '80px' }}>
            Active
          </span>
        ) : (
          <span className="badge bg-danger bg-opacity-10 text-white" style={{ minWidth: '80px' }}>
            Inactive
          </span>
        );
      },
    }

  ];

  // Add Actions Column only for admin manage mode
  if (isAdminManage) {
    columns.push({
      accessorKey: 'actions',
      header: 'Actions',
      size: 100,
      cell: ({ row }) => {
        const coach = row.original;
        const coachId = coach.u_id || coach.id;

        return (
          <div className="d-flex justify-content-end">
            <Dropdown
              dropdownItems={[
                {
                  label: 'Edit',
                  icon: <FiEdit className="me-2" size={14} />,
                  onClick: () => openEditModal(coach),
                },
              ]}
              triggerClass="btn btn-sm btn-outline-secondary d-flex align-items-center"
              triggerIcon={<FiMoreHorizontal size={16} />}
            />
          </div>
        );
      },
    });
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="h3 mb-2">{title}</h1>
          <p className="text-muted mb-0">
            Manage club coaches. You can edit and activate/deactivate coaches.
          </p>
        </div>

        {isAdminManage && (
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={openAddModal}
          >
            <FiPlus size={16} />
            <span>Add Coach</span>
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="all">Select Region</option>
              <option value="asia">Asia</option>
              <option value="africa">Africa</option>
             
            </select>
          </div>
        </div>
      </div>

      {/* Coaches Table */}
      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body p-0">
          <Table
            data={filteredCoaches}
            columns={columns}
            loading={loading}
            enablePagination={true}
            pageSize={10}
            emptyMessage={
              searchQuery || regionFilter !== 'all'
                ? "No matching coaches found."
                : "No coaches found. Click 'Add Coach' to create one."
            }
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-semibold">
                    {editingId ? "Edit Coach" : "Add Coach"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    disabled={saving}
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium">Full Name *</label>
                      <input
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        disabled={saving}
                        required
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Username *</label>
                      <input
                        className="form-control"
                        name="username"
                        value={form.username}
                        onChange={handleFormChange}
                        disabled={saving}
                        required
                        placeholder="Enter username"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handleFormChange}
                        disabled={saving}
                        required
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Region *</label>
                      <select
                        className="form-select"
                        name="region"
                        value={form.region}
                        onChange={handleFormChange}
                        disabled={saving}
                        required
                      >
                        <option value="">Select Region</option>
                        <option value="asia">Asia</option>
                        <option value="africa">Africa</option>
                     
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">
                        {editingId ? "New Password" : "Password *"}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={form.password}
                        onChange={handleFormChange}
                        disabled={saving}
                        placeholder={editingId ? "Leave blank to keep current" : "Enter password"}
                        minLength={editingId ? 0 : 6}
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="status"
                          checked={form.status === 1}
                          onChange={handleFormChange}
                          disabled={saving}
                        />
                        <label className="form-check-label fw-medium">
                          Account Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-light"
                    disabled={saving}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {editingId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      editingId ? "Update Coach" : "Create Coach"
                    )}
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

export default CoachTable;