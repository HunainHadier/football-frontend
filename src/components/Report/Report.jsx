import React, { useEffect, useState, useMemo } from 'react';
import Table from '@/components/shared/table/Table';
import { FiBarChart, FiFilter, FiDownload, FiUser, FiCalendar, FiAward } from 'react-icons/fi';
import { getToken } from '@/utils/auth';
import topTost from '@/utils/topTost';

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const Reports = ({ title = "Performance Reports", mode = "admin-reports" }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playerFilter, setPlayerFilter] = useState('all');
  const [matchFilter, setMatchFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  const token = getToken();

  // Fetch API functions
  const fetchReportsApi = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/reports`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch reports');
    }
    return result;
  };

  const fetchPlayersApi = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/players`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch players');
    }
    return result;
  };

  const fetchMatchesApi = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/matches`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch matches');
    }
    return result;
  };

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsData, playersData, matchesData] = await Promise.all([
        fetchReportsApi(),
        fetchPlayersApi(),
        fetchMatchesApi()
      ]);

      setReports(reportsData.reports || reportsData || []);
      setPlayers(playersData.players || playersData || []);
      setMatches(matchesData.matches || matchesData || []);

    } catch (err) {
      console.error('Error loading reports data:', err);
      topTost(err.message || 'Failed to load reports data', 'error');
      setReports([]);
      setPlayers([]);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter reports based on filters
  const filteredReports = useMemo(() => {
    let filtered = reports;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((report) =>
        (report.player_name || '').toLowerCase().includes(query) ||
        (report.match_name || '').toLowerCase().includes(query)
      );
    }

    // Apply player filter
    if (playerFilter !== 'all') {
      filtered = filtered.filter(report => 
        report.player_id?.toString() === playerFilter
      );
    }

    // Apply match filter
    if (matchFilter !== 'all') {
      filtered = filtered.filter(report => 
        report.match_id?.toString() === matchFilter
      );
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.evaluation_date || report.created_at);
        const filterDate = new Date(dateFilter);
        return reportDate.toDateString() === filterDate.toDateString();
      });
    }

    return filtered;
  }, [reports, searchQuery, playerFilter, matchFilter, dateFilter]);

  // Calculate score badge color
  const getScoreBadge = (score) => {
    if (score >= 4) return 'bg-success bg-opacity-10 text-success';
    if (score >= 3) return 'bg-warning bg-opacity-10 text-warning';
    return 'bg-danger bg-opacity-10 text-danger';
  };

  // Export reports
  const handleExport = (format) => {
    topTost(`Exporting reports as ${format}`, 'info');
    // Add export logic here
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
      accessorKey: 'player',
      header: () => (
        <div className="d-flex align-items-center">
          <FiUser size={16} className="me-2" />
          <span>Player</span>
        </div>
      ),
      size: 180,
      cell: (info) => {
        const report = info.row.original;
        return (
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                 style={{ width: 40, height: 40 }}>
              <FiUser className="text-primary" />
            </div>
            <div>
              <div className="fw-semibold">{report.player_name}</div>
              <div className="small text-muted">ID: {report.player_id}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'match',
      header: () => (
        <div className="d-flex align-items-center">
          <FiCalendar size={16} className="me-2" />
          <span>Match</span>
        </div>
      ),
      size: 200,
      cell: (info) => {
        const report = info.row.original;
        return (
          <div>
            <div className="fw-medium">{report.match_name}</div>
            {report.match_date && (
              <div className="small text-muted">
                {new Date(report.match_date).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'average_score',
      header: () => (
        <div className="d-flex align-items-center">
          <FiAward size={16} className="me-2" />
          <span>Avg Score</span>
        </div>
      ),
      size: 120,
      cell: (info) => {
        const score = info.getValue();
        return (
          <span className={`badge ${getScoreBadge(score)} border-0 py-2 px-3`}>
            {score ? `${score}/5` : 'N/A'}
          </span>
        );
      },
    },
    {
      accessorKey: 'total_evaluations',
      header: 'Evaluations',
      size: 100,
      cell: (info) => (
        <div className="text-center">
          <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">
            {info.getValue() || 0}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'last_evaluation',
      header: 'Last Evaluation',
      size: 120,
      cell: (info) => {
        const date = info.getValue();
        return date ? (
          <div className="small text-muted">
            {new Date(date).toLocaleDateString()}
          </div>
        ) : (
          <div className="small text-muted">-</div>
        );
      },
    },
  ];

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      {/* Page Header */}
    

      {/* Main Card */}
      <div className="card border-0 shadow-sm rounded-3">
        {/* Gradient Header */}
        <div
          className="card-header border-0"
          style={{
            color: "#ffffff",
          }}
        >
          <h5 className="mb-1 fw-semibold text-white">Performance Reports</h5>
          <small className="d-block text-white">
            Filter by player, match, or date range to analyse form trends.
          </small>
        </div>

        <div className="card-body p-3 p-md-4">
          {/* Filters */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <label className="form-label fw-semibold text-muted">Search</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FiFilter size={14} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search players or matches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold text-muted">Player</label>
              <select 
                className="form-select"
                value={playerFilter}
                onChange={(e) => setPlayerFilter(e.target.value)}
              >
                <option value="all">All Players</option>
                {players.map(player => (
                  <option key={player.p_id || player.id} value={player.p_id || player.id}>
                    {player.p_name || player.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold text-muted">Match</label>
              <select 
                className="form-select"
                value={matchFilter}
                onChange={(e) => setMatchFilter(e.target.value)}
              >
                <option value="all">All Matches</option>
                {matches.map(match => (
                  <option key={match.m_id || match.id} value={match.m_id || match.id}>
                    {match.m_name || match.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold text-muted">Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Reports Table */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <Table
                data={filteredReports}
                columns={columns}
                loading={loading}
                enablePagination={true}
                pageSize={10}
                emptyMessage={
                  searchQuery || playerFilter !== 'all' || matchFilter !== 'all' || dateFilter
                    ? "No matching reports found with current filters."
                    : "No evaluation reports available."
                }
              />
            </div>
          </div>

          {/* Summary Stats */}
          {filteredReports.length > 0 && (
            <div className="row mt-4">
              <div className="col-md-3 col-6">
                <div className="card bg-primary bg-opacity-10 border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h4 className="mb-0 text-primary">{filteredReports.length}</h4>
                        <small className="text-muted">Total Reports</small>
                      </div>
                      <FiBarChart size={24} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card bg-success bg-opacity-10 border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h4 className="mb-0 text-success">
                          {Math.max(...filteredReports.map(r => r.average_score || 0)).toFixed(1)}
                        </h4>
                        <small className="text-muted">Highest Score</small>
                      </div>
                      <FiAward size={24} className="text-success" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card bg-info bg-opacity-10 border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h4 className="mb-0 text-info">
                          {new Set(filteredReports.map(r => r.player_id)).size}
                        </h4>
                        <small className="text-muted">Unique Players</small>
                      </div>
                      <FiUser size={24} className="text-info" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card bg-warning bg-opacity-10 border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h4 className="mb-0 text-warning">
                          {new Set(filteredReports.map(r => r.match_id)).size}
                        </h4>
                        <small className="text-muted">Matches Covered</small>
                      </div>
                      <FiCalendar size={24} className="text-warning" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-muted small mt-3 mb-0">
            Tip: Use filters to analyze specific player performance trends across different matches.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;