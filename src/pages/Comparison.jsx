
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CustomersHeader from '@/components/Players/PlayersHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const Comparison = () => {
    const { id: playerId } = useParams();
    const navigate = useNavigate();

    const [comparisonData, setComparisonData] = useState(null);
    const [loadingComparison, setLoadingComparison] = useState(true);
    const [error, setError] = useState("");

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [saving, setSaving] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));


    useEffect(() => {
        loadComparisonData();
    }, [playerId]);

    const loadComparisonData = async () => {
        setLoadingComparison(true);
        try {
            const token = localStorage.getItem("authToken");

            const res = await fetch(
                `${BASE_URL}/api/coach/stats/stats/avg/${playerId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const json = await res.json();

            if (!res.ok) throw new Error("Failed to load stats");

            // SAFE FALLBACKS
            setComparisonData({
                player: json.player || {},
                team: json.team || {},
                rawPlayer: json.rawPlayer || {},
                rawTeam: json.rawTeam || {},
            });

            setEditedData(json.rawPlayer || {});

        } catch (err) {
            setError("Failed to load comparison data: " + err.message);
        } finally {
            setLoadingComparison(false);
        }
    };

    const getPercentageDiff = (playerVal, teamVal) => {
        const p = parseFloat(playerVal) || 0;
        const t = parseFloat(teamVal) || 0;

        if (t === 0) return 0;

        return ((p / t) * 100).toFixed(1);
    };

    const getDiffColor = (diff) => {
        if (diff > 0) return "text-success";
        if (diff < 0) return "text-danger";
        return "text-secondary";
    };

    const statLabels = [
        { key: "goals", label: "Goals" },
        { key: "assists", label: "Assists" },
        { key: "shots", label: "Shots" },
        { key: "shots_on_goal", label: "Shots On Goal" },
        { key: "big_chances", label: "Big Chances" },
        { key: "key_passes", label: "Key Passes" },
        { key: "tackles", label: "Tackles" },
        { key: "pass_completion_pct", label: "Pass %" },
        { key: "minutes", label: "Minutes" },
        { key: "cautions", label: "Cautions" },
        { key: "ejections", label: "Ejections" },
        { key: "progressive_carries", label: "Progressive Carries" },
        { key: "defensive_actions", label: "Defensive Actions" },
    ];

    const handleEditClick = () => {
        setEditedData(comparisonData?.rawPlayer || {});
        setEditModalOpen(true);
    };

    const handleInputChange = (key, value) => {
        setEditedData(prev => ({
            ...prev,
            [key]: parseFloat(value) || 0
        }));
    };

    const handleSaveChanges = async () => {
        if (!playerId) {
            alert("Player ID not available");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${BASE_URL}/api/coach/stats/stats/update/${playerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editedData),
            });

            if (!response.ok) {
                throw new Error("Failed to update statistics");
            }

            alert("Statistics updated successfully!");
            setEditModalOpen(false);
            loadComparisonData();

        } catch (error) {
            alert("Failed to update statistics: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedData(comparisonData?.rawPlayer || {});
        setEditModalOpen(false);
    };

    const handleBack = () => navigate(-1);

    const safePlayer = comparisonData?.player || {};
    const safeTeam = comparisonData?.team || {};
    const safeRaw = comparisonData?.rawPlayer || {};

    return (
        <>
            <PageHeader>
                <CustomersHeader />
            </PageHeader>

            <div className='main-content'>
                <div className='container py-4'>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <button className="btn btn-outline-secondary" onClick={handleBack}>
                            ← Back
                        </button>

                        <h4 className="mb-0">Player vs Team Comparison</h4>

                        <div>
                            {user?.role !== "ADMIN" && (
                                <button
                                    className="btn btn-warning d-flex align-items-center gap-2"
                                    onClick={handleEditClick}
                                    disabled={loadingComparison || !comparisonData}
                                >
                                    <i className="bi bi-pencil"></i> Edit Stats
                                </button>
                            )}
                        </div>
                    </div>


                    {loadingComparison ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" />
                            <p className="mt-2">Loading comparison data...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            {error}
                            <button className="btn btn-secondary ms-3" onClick={handleBack}>
                                Go Back
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <h5>Per-Match Averages</h5>

                            <table className="table table-striped table-hover">
                                <thead className="text-white bg-dark">
                                    <tr>
                                        <th>Stat</th>
                                        <th className="text-center">Actual Player Value</th>
                                        <th className="text-center">Player Score Per Match</th>
                                        <th className="text-center">Team Score Per Match</th>
                                        <th className="text-center">Player Contribution</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {statLabels.map(({ key, label }) => {
                                        const rawPlayerVal = parseFloat(safeRaw[key] || 0);
                                        const playerAvg = parseFloat(safePlayer[key] || 0);
                                        const teamAvg = parseFloat(safeTeam[key] || 0);

                                        const diff = getPercentageDiff(playerAvg, teamAvg);

                                        return (
                                            <tr key={key}>
                                                <td className="fw-semibold">{label}</td>
                                                <td className="text-center">{rawPlayerVal}</td>
                                                <td className="text-center">{playerAvg.toFixed(2)}</td>
                                                <td className="text-center">{teamAvg.toFixed(2)}</td>
                                                <td className={`text-center fw-bold ${getDiffColor(diff)}`}>
                                                    {diff > 0 ? "+" : ""}{diff}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            {/* --- Modal --- */}
            {editModalOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: "rgba(0,0,0,0.65)", zIndex: 5000 }}
                >
                    <div
                        className="bg-white p-4 rounded shadow"
                        style={{ width: "90%", maxWidth: 800, maxHeight: "85vh", overflowY: "auto" }}
                    >
                        <div className="d-flex justify-content-between mb-3">
                            <h5>Edit Player Statistics</h5>
                            <button className="btn btn-sm btn-danger" onClick={handleCancelEdit} disabled={saving}>
                                Close
                            </button>
                        </div>

                        <table className="table table-striped table-hover">
                            <thead className="bg-dark text-white">
                                <tr>
                                    <th>Stat</th>
                                    <th className="text-center">Actual Value</th>
                                </tr>
                            </thead>

                            <tbody>
                                {statLabels.map(({ key, label }) => (
                                    <tr key={key}>
                                        <td>{label}</td>
                                        <td className="text-center">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm text-center"
                                                value={editedData[key] || 0}
                                                onChange={(e) => {
                                                    let val = e.target.value.replace(/\D/g, "");
                                                    handleInputChange(key, val);
                                                }}
                                                min="0"
                                                step="1"
                                                disabled={saving}
                                                style={{ width: "120px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="d-flex justify-content-end mt-3 gap-2">
                            <button className="btn btn-secondary" onClick={handleCancelEdit} disabled={saving}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSaveChanges} disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Comparison;
