import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CustomersHeader from '@/components/Players/PlayersHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const TeamComparisonPage = () => {
    const { id: teamId } = useParams();
    const navigate = useNavigate();
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));


    // Edit modal states
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [saving, setSaving] = useState(false);

    // Stat Labels
    const statLabels = [
        // { key: "matches", label: "Matches" },
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

    useEffect(() => {
        loadTeamData();
    }, [teamId]);

    const loadTeamData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(
                `${BASE_URL}/api/stats/average/${teamId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const json = await res.json();
            console.log("Full API Response:", json); // Debugging

            if (!res.ok) {
                throw new Error(json.message || "Failed to load team stats");
            }

            // Check different possible response structures
            if (json.rawTeam || json.team) {
                setTeamData({
                    rawTeam: json.rawTeam || {},
                    team: json.team || {}
                });
            } else if (json.data) {
                // Agar data key mein hai
                setTeamData({
                    rawTeam: json.data.rawTeam || {},
                    team: json.data.team || {}
                });
            } else {
                // Direct team data
                setTeamData({
                    rawTeam: json || {},
                    team: json || {}
                });
            }

        } catch (err) {
            console.error("Error loading team data:", err);
            setError("Failed to load team data: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Edit modal functions
    const handleEditClick = () => {
        if (teamData?.rawTeam) {
            const editableData = {
                matches: teamData.rawTeam.matches || 0,
                goals: teamData.rawTeam.goals || 0,
                assists: teamData.rawTeam.assists || 0,
                shots: teamData.rawTeam.shots || 0,
                shots_on_goal: teamData.rawTeam.shots_on_goal || 0,
                big_chances: teamData.rawTeam.big_chances || 0,
                key_passes: teamData.rawTeam.key_passes || 0,
                tackles: teamData.rawTeam.tackles || 0,
                pass_completion_pct: teamData.rawTeam.pass_completion_pct || 0,
                minutes: teamData.rawTeam.minutes || 0,
                cautions: teamData.rawTeam.cautions || 0,
                ejections: teamData.rawTeam.ejections || 0,
                progressive_carries: teamData.rawTeam.progressive_carries || 0,
                defensive_actions: teamData.rawTeam.defensive_actions || 0
            };
            setEditedData(editableData);
        }
        setEditModalOpen(true);
    };

    const handleInputChange = (key, value) => {
        setEditedData(prev => ({
            ...prev,
            [key]: parseFloat(value) || 0
        }));
    };

    const handleSaveChanges = async () => {
        if (!teamId) {
            alert("Team ID not available");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem("authToken");

            // Prepare data for update
            const updateData = {
                matches: editedData.matches || 0,
                goals: editedData.goals || 0,
                assists: editedData.assists || 0,
                shots: editedData.shots || 0,
                shots_on_goal: editedData.shots_on_goal || 0,
                big_chances: editedData.big_chances || 0,
                key_passes: editedData.key_passes || 0,
                tackles: editedData.tackles || 0,
                pass_completion_pct: editedData.pass_completion_pct || 0,
                minutes: editedData.minutes || 0,
                cautions: editedData.cautions || 0,
                ejections: editedData.ejections || 0,
                progressive_carries: editedData.progressive_carries || 0,
                defensive_actions: editedData.defensive_actions || 0
            };

            console.log("Sending team update data:", updateData);

            const response = await fetch(`${BASE_URL}/api/coach/stats/stats/update-team/${teamId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to update team statistics");
            }

            alert("Team statistics updated successfully!");

            // Modal band karein aur data refresh karein
            setEditModalOpen(false);
            loadTeamData(); // Data refresh karein

        } catch (error) {
            console.error("Team update error:", error);
            alert("Failed to update team statistics: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedData(teamData?.rawTeam || {});
        setEditModalOpen(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Safe data access
    const getTeamValue = (data, key) => {
        if (!data) return 0;
        return parseFloat(data[key] || 0);
    };

    return (
        <>
            <PageHeader>
                <CustomersHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='container py-4'>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <button className="btn btn-outline-secondary" onClick={handleBack}>
                            ← Back to Teams
                        </button>

                        {user?.role !== "ADMIN" && (
                            <button
                                className="btn btn-warning d-flex align-items-center gap-2"
                                onClick={handleEditClick}
                                disabled={loading || !teamData}
                            >
                                <i className="bi bi-pencil"></i>
                                Edit Stats
                            </button>
                        )}

                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" />
                            <p className="mt-2">Loading team statistics...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            {error}
                            <button className="btn btn-secondary ms-3" onClick={handleBack}>
                                Go Back
                            </button>
                        </div>
                    ) : teamData ? (
                        <div className="table-responsive">
                            <h5>Team Statistics</h5>
                            <table className="table table-striped table-hover">
                                <thead className="text-white bg-dark">
                                    <tr>
                                        <th>Stat</th>
                                        <th className="text-center">Team Actual Value</th>
                                        <th className="text-center">Team Score Per Match</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statLabels.map(({ key, label }) => {
                                        const teamRawVal = getTeamValue(teamData.rawTeam, key);
                                        const teamAvg = getTeamValue(teamData.team, key);

                                        return (
                                            <tr key={key}>
                                                <td className="fw-semibold">{label}</td>
                                                <td className="text-center">{teamRawVal}</td>
                                                <td className="text-center">{teamAvg.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-warning">
                            No team statistics available for this team.
                            <button className="btn btn-secondary ms-3" onClick={handleBack}>
                                Go Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />

            {/* Edit Team Stats Modal */}
            {editModalOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: "rgba(0,0,0,0.65)", zIndex: 5000 }}
                >
                    <div
                        className="bg-white p-4 rounded shadow"
                        style={{ width: "90%", maxWidth: 800, maxHeight: "85vh", overflowY: "auto" }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold">Edit Team Statistics</h5>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={handleCancelEdit}
                                disabled={saving}
                            >
                                Close
                            </button>
                        </div>

                        <div className="table-responsive">
                            <h6>Edit Team Actual Values</h6>
                            <table className="table table-striped table-hover">
                                <thead className="text-white bg-dark">
                                    <tr>
                                        <th>Stat</th>
                                        <th className="text-center">Actual Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statLabels.map(({ key, label }) => (
                                        <tr key={key}>
                                            <td className="fw-semibold">{label}</td>
                                            <td className="text-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center"
                                                    value={editedData[key] || 0}
                                                    onChange={(e) => {
                                                        let val = e.target.value;
                                                        // remove decimal part (block . and anything after)
                                                        val = val.replace(/\D/g, "");
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

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSaveChanges}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default TeamComparisonPage;