
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiEye, FiDownload, FiInfo } from "react-icons/fi";
import Chart from "chart.js/auto";
import EvaluationModal from "../../components/Players/EvaluationModel";

const PlayerEvaluations = () => {
  const { id } = useParams();
  const playerId = id;

  const [evaluations, setEvaluations] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);
  const [competencyData, setCompetencyData] = useState(null);
  const [loadingCompetency, setLoadingCompetency] = useState(false);

  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const [showDefinitionsModal, setShowDefinitionsModal] = useState(false);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

  useEffect(() => {
    loadEvaluations();
    loadPlayer();
  }, []);

  const loadEvaluations = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${BASE_URL}/api/coach/evaluation/player/${playerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (data.data && data.data.behavior_answers) {
        const evaluationData = {
          id: data.data.evaluation_id,
          created_at: data.data.created_at,
          total_score: data.data.total_score,
          behavior_answers: data.data.behavior_answers
        };
        setEvaluations([evaluationData]);
      } else if (data.evaluations) {
        const sorted = (data.evaluations || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setEvaluations(sorted);
      } else {
        setEvaluations([]);
      }
    } catch (err) {
      console.log("Error loading evaluations:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPlayer = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${BASE_URL}/api/coach/evaluation/player/${playerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (data.data) {
        setPlayerInfo({
          p_name: data.data.player_name,
          team_name: data.data.team_name,
          player_id: data.data.player_id,
          team_id: data.data.team_id
        });
      } else {
        setPlayerInfo(data.data || data);
      }
    } catch (err) {
      console.log("Error loading player:", err);
    }
  };

  const filtered = evaluations.filter((e) =>
    e.created_at?.toLowerCase().includes(filter.toLowerCase())
  );

  const viewGraph = async (evaluation) => {
    setSelectedEval(evaluation);
    setShowModal(true);
    setShowDownloadModal(false);
    setLoadingCompetency(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user && user.role === "ADMIN";
    const isAfrica = user && user.u_region === "africa";

    if (isAdmin) {
      const asiaUrl = `${BASE_URL}/api/asia/score/${playerId}`;
      const africaUrl = `${BASE_URL}/api/africa/score/${playerId}`;
      let data = null;
      let region = false; // false for Asia, true for Africa

      // Try Asia first
      try {
        const asiaRes = await fetch(asiaUrl);
        if (asiaRes.ok) {
          const asiaJson = await asiaRes.json();
          if (!asiaJson.error) {
            data = asiaJson;
            region = false;
          }
        } else {
          console.log("Asia API returned status:", asiaRes.status);
        }
      } catch (err) {
        console.log("Asia API failed:", err);
      }

      // If Asia failed, try Africa immediately
      if (!data) {
        try {
          const africaRes = await fetch(africaUrl);
          if (africaRes.ok) {
            const africaJson = await africaRes.json();
            if (!africaJson.error) {
              data = africaJson;
              region = true;
            }
          } else {
            console.log("Africa API returned status:", africaRes.status);
          }
        } catch (err) {
          console.log("Africa API failed:", err);
        }
      }

      setCompetencyData(data);
      setTimeout(() => {
        if (data) renderCompetencyChart(data, region, chartRef.current);
      }, 200);
    } else {
      const apiUrl = isAfrica
        ? `${BASE_URL}/api/africa/score/${playerId}`
        : `${BASE_URL}/api/asia/score/${playerId}`;
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setCompetencyData(data);
        setTimeout(() => renderCompetencyChart(data, isAfrica, chartRef.current), 200);
      } catch (err) {
        console.log("Error loading competency data:", err);
        setCompetencyData(null);
      }
    }
    setLoadingCompetency(false);
  };
  const cleanScore = (score) => {
    // If the score is missing, return '0.00'
    if (score === undefined || score === null || score === "") return '0.00';

    // If it's a string (like "67.156%"), remove all non-numeric characters and convert to float
    if (typeof score === 'string') {
      const cleaned = score.replace(/[^0-9.]/g, '');
      return parseFloat(cleaned).toFixed(2);
    }

    // If it's already a number (like 69.05), ensure it has 2 decimal places
    return parseFloat(score).toFixed(2);
  };

  const openDownloadModal = (evaluation) => {
    setSelectedEval(evaluation);
    setShowDownloadModal(true);
    setShowModal(false);
  };

  const renderCompetencyChart = (data, isAfrica, ctx) => {
    if (chartInstance.current) chartInstance.current.destroy();

    let labels = [];
    let scores = [];
    let levels = [];
    let margins = [];
    let teamAvgScores = [];

    if (isAfrica && Array.isArray(data.Competency_Metrics)) {
      labels = data.Competency_Metrics.map((comp) => comp.Competency);
      scores = data.Competency_Metrics.map((comp) =>
        parseFloat(comp.Competency_Score_Percent)
      );
      levels = data.Competency_Metrics.map((comp) => comp.Level);
      margins = data.Competency_Metrics.map((comp) =>
        parseFloat(comp.Margin_for_Mastering_Next_Level_Percent)
      );

      if (data.Team_Average_Scores) {
        teamAvgScores = labels.map(
          (label) => data.Team_Average_Scores[label] || 0
        );
      }
    } else if (!isAfrica) {
      const competencies = [
        "game_awareness",
        "team_work",
        "discipline_ethics",
        "resilience",
        "focus",
        "leadership",
        "communication",
        "endurance",
        "speed",
        "agility"
      ];
      labels = competencies.map((key) =>
        key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      );
      scores = competencies.map((key) =>
        data[key] ? parseFloat(data[key].competency_score.replace("%", "")) : 0
      );
      levels = competencies.map((key) =>
        data[key] ? data[key].level : "N/A"
      );
      margins = competencies.map((key) =>
        data[key]
          ? parseFloat(data[key].margin_for_mastering_next_level.replace("%", ""))
          : 0
      );

      if (data.Team_Average_Scores) {
        teamAvgScores = competencies.map(
          (key) => data.Team_Average_Scores[key] || 0
        );
      }
    }

    const datasets = [
      {
        label: "Player Score (%)",
        data: scores,
        backgroundColor: "rgba(74, 163, 240, 0.2)",
        borderColor: "#4AA3F0",
        borderWidth: 2,
        pointBackgroundColor: "#1A73E8",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#1A73E8",
      },
    ];

    if (teamAvgScores.length > 0) {
      datasets.push({
        label: "Team Average (%)",
        data: teamAvgScores,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "#EF4444",
        borderWidth: 2,
        pointBackgroundColor: "#DC2626",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#DC2626",
      });
    }

    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const index = ctx.dataIndex;
                if (ctx.datasetIndex === 0) {
                  return [
                    `Player Score: ${scores[index]}%`,
                    `Level: ${levels[index]}`,
                    `Gap for Next Level: ${margins[index]}%`,
                  ];
                } else {
                  return `Team Average: ${teamAvgScores[index]}%`;
                }
              },
            },
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: (value) => `${value}%`,
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            angleLines: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            pointLabels: {
              font: { size: 12 },
            },
          },
        },
      },
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="fw-bold">Player Evaluations</h3>
          <p className="text-muted">{playerInfo.p_name}</p>
        </div>
      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by date..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="text-white bg-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((ev, i) => (
                <tr key={ev.id}>
                  <td>{i + 1}</td>
                  <td>{ev.created_at?.split("T")[0]}</td>

                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-info px-3"
                        onClick={() => viewGraph(ev)}
                      >
                        <FiEye size={14} /> View
                      </button>

                      <button
                        className="btn btn-sm btn-outline-primary px-3"
                        onClick={() => openDownloadModal(ev)}
                      >
                        <FiDownload size={14} /> Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    No evaluations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.55)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div
            className="bg-white rounded shadow-lg"
            style={{
              width: "90%",
              maxWidth: "1100px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              padding: "20px",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center mb-3 pb-2"
              style={{ borderBottom: "1px solid #eee" }}
            >
              <h5 className="fw-bold m-0">Competency Radar Chart</h5>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>

            <div style={{ overflowY: "auto", paddingRight: "10px" }}>
              {loadingCompetency ? (
                <p>Loading competency data...</p>
              ) : competencyData ? (
                <div>
                  {/* <h6 className="mb-3">
                    Player Behavior Overall Score: {competencyData.Player_Behavior_Overall_Score || competencyData.player_behavior_trait_overall_score}%
                  </h6> */}

                  {/* <h6 className="mb-3">
                    Team avarage: {competencyData.Team_Behavior_Overall_Score || competencyData.Team_Behavior_Trait_Overall_Score}%
                  </h6> */}




                  <h6 className="mb-3">
                    Player Behavior Overall Score: {
                      cleanScore(competencyData.Player_Behavior_Overall_Score || competencyData.player_behavior_trait_overall_score)
                    }%
                  </h6>


                  <h6 className="mb-3">
                    Team avarage: {
                      cleanScore(competencyData.Team_Behavior_Overall_Score ||
                        (competencyData.Team_Average_Scores && competencyData.Team_Average_Scores.Team_Behavior_Trait_Overall_Score))
                    }%
                  </h6>
                  <div
                    style={{
                      height: "450px",
                      padding: "15px",
                      border: "1px solid #eee",
                      borderRadius: "10px",
                      background: "#fafafa",
                    }}
                  >
                    <canvas ref={chartRef} style={{ width: "100%", height: "100%" }}></canvas>
                  </div>
                </div>
              ) : (
                <p>No data available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showDefinitionsModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.55)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div
            className="bg-white rounded shadow-lg"
            style={{
              width: "95%",
              maxWidth: "1200px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              padding: "25px",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center mb-3 pb-3"
              style={{ borderBottom: "2px solid #eee" }}
            >
              <h4 className="fw-bold m-0">Competency Definitions</h4>
              <button
                className="btn btn-danger"
                onClick={() => setShowDefinitionsModal(false)}
              >
                Close
              </button>
            </div>

            <div style={{ overflowY: "auto", paddingRight: "10px" }}>
              {/* Definitions content would go here if needed */}
            </div>
          </div>
        </div>
      )}

      {showDownloadModal && selectedEval && (
        <EvaluationModal
          playerId={playerId}
          evaluation={selectedEval}
          onClose={() => setShowDownloadModal(false)}
        />
      )}
    </div>
  );
};

export default PlayerEvaluations;
