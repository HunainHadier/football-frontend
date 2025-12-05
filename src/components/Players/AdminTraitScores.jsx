// src/pages/admin/AdminTraitScores.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Radar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const AdminTraitScores = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/admin/players/${playerId}/trait-scores`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(err.message || "Failed to fetch");
        }
        const json = await res.json();
        setPayload(json);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playerId]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;
  if (!payload) return null;

  const { player, evaluations, traitsSummary, trends } = payload;

  // Prepare Radar data (traitsSummary)
  const traitLabels = Object.keys(traitsSummary || {});
  const traitData = Object.values(traitsSummary || {}).map(v => (v === null ? 0 : v));

  const radarData = {
    labels: traitLabels,
    datasets: [
      {
        label: "Trait average",
        data: traitData,
        fill: true,
        backgroundColor: "rgba(54,162,235,0.12)",
        borderColor: "rgba(54,162,235,0.9)",
      },
    ],
  };

  const radarOptions = {
    scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } },
    plugins: { legend: { display: false } },
  };

  const lineData = {
    labels: trends?.labels ?? [],
    datasets: [
      {
        label: "Avg score",
        data: trends?.data ?? [],
        fill: true,
        tension: 0.3,
        backgroundColor: "rgba(75,192,192,0.12)",
        borderColor: "rgba(75,192,192,0.9)",
      },
    ],
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 className="mb-1">{player.p_name}</h3>
          <div className="text-muted">
            Age: {player.p_age ?? "-"} • Added by: {player.coach_name ?? "-"}
          </div>
        </div>
        <div>
          <button className="btn btn-light me-2" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-6">
          <div className="card p-3">
            <h6 className="mb-2">Behaviour Traits</h6>
            <div style={{ height: 320 }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-3">
            <h6 className="mb-2">Weekly Trend</h6>
            <div style={{ height: 320 }}>
              <Line data={lineData} />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h6 className="mb-0 fw-bold">Evaluations</h6>
          <span className="badge bg-white bg-opacity-10 text-primary px-3 py-2">
            {evaluations.length} Records
          </span>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Evaluator</th>
                  <th>Total Score</th>
                  <th className="text-right">Details</th>
                </tr>
              </thead>

              <tbody>
                {evaluations.map((ev) => (
                  <React.Fragment key={ev.e_id}>
                    <tr>
                      <td className="fw-semibold">
                        {new Date(ev.created_at).toLocaleString()}
                      </td>

                      <td>
                        <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-2">
                          {ev.evaluator_name ?? "Unknown"}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                          {ev.e_total_score ?? "-"}
                        </span>
                      </td>

                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary px-3"
                          data-bs-toggle="collapse"
                          data-bs-target={`#ev-${ev.e_id}`}
                          aria-expanded="false"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>

                    {/* COLLAPSE ROW */}
                    <tr className="collapse bg-light" id={`ev-${ev.e_id}`}>
                      <td colSpan="4" className="p-4">
                        <div className="row g-3">

                          {Object.entries(ev.questions).map(([qk, qv]) => (
                            <div className="col-md-4 col-sm-6" key={qk}>
                              <div className="p-3 border rounded bg-white shadow-sm h-100">
                                <div className="text-muted small">{qk.toUpperCase()}</div>
                                <div className="fw-bold fs-5 mt-1">{qv ?? "-"}</div>
                              </div>
                            </div>
                          ))}

                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}

                {evaluations.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No evaluations yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminTraitScores;
