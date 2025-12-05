// src/components/Players/PlayerProfile.jsx
import React, { useEffect, useState } from "react";
import PastPlayerStats from "@/components/Players/PastPlayerStats";

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

const PlayerProfile = () => {
    const { id: playerId } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [player, setPlayer] = useState(null);
    const [hasStats, setHasStats] = useState(false);
    const [showStats, setShowStats] = useState(false);

    // SAFE ARRAY
    const [evaluations, setEvaluations] = useState([]);
    const [traitsSummary, setTraitSummary] = useState({});
    const [trends, setTrends] = useState({ labels: [], data: [] });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            const apiUrl =`${BASE_URL}/api/coach/players/${playerId}/profile`;

            const res = await fetch(apiUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const json = await res.json();
            setPlayer(json.player || {});
            setEvaluations(json.evaluations || []);

            if (role === "ADMIN") {
                setTraitSummary(json.traitsSummary || {});
                setTrends(json.trends || { labels: [], data: [] });
            }

            // ⭐ NEW: Check player stats
            const statsRes = await fetch(
                `${BASE_URL}/api/coach/stats/list/${playerId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const statsJson = await statsRes.json();

            // Agar stats list > 0 → button hide
            setHasStats(statsJson.stats?.length > 0);

        } catch (err) {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-danger">{error}</div>;

    const safeEvals = evaluations || [];

    const avgScore =
        safeEvals.length > 0
            ? (
                safeEvals.reduce((acc, e) => acc + (e.e_total_score || 0), 0) /
                safeEvals.length
            ).toFixed(2)
            : 0;

    const radarData = {
        labels: Object.keys(traitsSummary || {}),
        datasets: [
            {
                label: "Behaviour Traits Average",
                data: Object.values(traitsSummary || {}),
                fill: true,
                backgroundColor: "rgba(54,162,235,0.3)",
                borderColor: "rgba(54,162,235,1)",
            },
        ],
    };

    const lineData = {
        labels: trends.labels || [],
        datasets: [
            {
                label: "Weekly Avg Score",
                data: trends.data || [],
                fill: true,
                tension: 0.4,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
            },
        ],
    };

    return (
        <div className="container-fluid p-4">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="m-0">{player.p_name}</h3>

                {/* HIDE ADD BUTTONS FOR ADMIN */}
                <div className="d-flex gap-2">
                    {role !== "ADMIN" && !hasStats && (
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/playerstats/${playerId}`)}
                        >
                            Add Player Stats
                        </button>
                    )}

                    {/* VIEW BUTTONS FOR BOTH */}
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(`/coach/evaluate/${playerId}`)}
                    >
                        View Behaviour Traits
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => setShowStats(true)}
                    >
                        View Player Stats
                    </button>

                    <button className="btn btn-light" onClick={() => navigate(-1)}>
                        Back
                    </button>
                </div>
            </div>

            {/* PLAYER INFORMATION */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5>Player Information</h5>
                    <div className="row mt-3">
                        <div className="col-md-3">
                            <strong>Name:</strong> {player.p_name || 'N/A'}
                        </div>
                        <div className="col-md-3">
                            <strong>Email:</strong> {player.p_email || 'N/A'}
                        </div>
                        <div className="col-md-3">
                            <strong>Age:</strong> {player.p_age || 'N/A'}
                        </div>
                        {player.team_name && (
                            <div className="col-md-3">
                                <strong>Team:</strong> {player.team_name}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="row g-3 mb-4">
                {player.Player_Behavior_Overall_Score !== undefined && player.Player_Behavior_Overall_Score !== null && (
                    <div className="col-md-4">
                        {/* <div className="card text-center p-3 shadow-sm">
                            <h6>Overall Behavior Score</h6>
                            <h3>{player.Player_Behavior_Overall_Score}</h3>
                        </div> */}
                    </div>
                )}
{/* 
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm">
                        <h6>Total Evaluations</h6>
                        <h3>{safeEvals.length}</h3>
                    </div>
                </div> */}

                {/* <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm">
                        <h6>Average Score</h6>
                        <h3>{avgScore}</h3>
                    </div>
                </div> */}
{/* 
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm">
                        <h6>Last Evaluation</h6>
                        <h5>
                            {safeEvals.length
                                ? new Date(safeEvals[0].created_at).toLocaleDateString()
                                : "N/A"}
                        </h5>
                    </div>
                </div> */}
            </div>

            {/* ADMIN ONLY CHARTS */}
          
            {/* STATS MODAL */}
            {showStats && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: "rgba(0,0,0,0.45)", zIndex: 4000 }}
                >
                    <div
                        className="bg-white rounded shadow p-0"
                        style={{ width: "90%", maxWidth: "1200px", height: "90vh", overflowY: "auto" }}
                    >
                        <div className="d-flex justify-content-end p-2 border-bottom">
                            <button className="btn btn-danger btn-sm" onClick={() => setShowStats(false)}>
                                Close
                            </button>
                        </div>

                        {/* ⭐ PastPlayerStats component inside modal */}
                        <PastPlayerStats playerId={playerId} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerProfile;