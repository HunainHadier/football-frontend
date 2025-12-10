import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CustomersHeader from '@/components/Players/PlayersHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
// Assuming you have topTost and topTostError imported, as is common practice
import topTost from '../utils/topTost'; 



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

    // Stat Labels (Excluding 'matches' from the mapped list for the main table)
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

    useEffect(() => {
        loadTeamData();
    }, [teamId]);

    const loadTeamData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(
                // Assuming this API fetches both raw and averaged data
                `${BASE_URL}/api/stats/average/${teamId}`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Failed to load team stats");
            }

            let rawTeamData = {};
            let teamAvgData = {};

            // Determine data structure from response
            if (json.rawTeam || json.team) {
                rawTeamData = json.rawTeam || {};
                teamAvgData = json.team || {};
            } else if (json.data) {
                rawTeamData = json.data.rawTeam || {};
                teamAvgData = json.data.team || {};
            } else {
                // Direct team data (assuming raw is also the average if no split)
                rawTeamData = json || {};
                teamAvgData = json || {};
            }

            setTeamData({
                rawTeam: rawTeamData,
                team: teamAvgData
            });
            
            // Initialize editedData with raw team stats (including 'matches')
            setEditedData(rawTeamData);

        } catch (err) {
            console.error("Error loading team data:", err);
            setError("Failed to load team data: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Edit modal functions
    const handleEditClick = () => {
        // Use the rawTeam data for editing
        setEditedData(teamData?.rawTeam || {});
        setEditModalOpen(true);
    };

    const handleInputChange = (key, value) => {
        let processedValue;
        if (key === 'matches' || key === 'minutes') {
            // Treat matches and minutes as integers
            processedValue = parseInt(value) || 0;
        } else {
            // Treat other stats as floats
            processedValue = parseFloat(value) || 0;
        }

        setEditedData(prev => ({
            ...prev,
            [key]: processedValue
        }));
    };

    const handleSaveChanges = async () => {
        if (!teamId) {
            topTostError("Team ID not available. Cannot save changes.");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem("authToken");

            // Remove non-stat keys like ts_id, team_id, year, created_at before sending for update
            const { ts_id, team_id, year, created_at, ...dataToUpdate } = editedData;

            // Ensure matches is sent as a number
            dataToUpdate.matches = parseInt(editedData.matches) || 0;
            
            console.log("Sending team update data:", dataToUpdate);

            const response = await fetch(`${BASE_URL}/api/coach/stats/stats/update-team/${teamId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(dataToUpdate),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to update team statistics");
            }

            topTost("Team statistics updated successfully!");

            // Close modal and refresh data
            setEditModalOpen(false);
            loadTeamData(); 

        } catch (error) {
            console.error("Team update error:", error);
            topTostError("Failed to update team statistics: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        // Reset editedData to the original raw data on cancel
        setEditedData(teamData?.rawTeam || {});
        setEditModalOpen(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Safe data access
    const getTeamValue = (data, key) => {
        if (!data) return 0;
        // Use the raw value for matches in the title
        if (key === 'matches') return parseInt(data[key] || 0); 
        return parseFloat(data[key] || 0);
    };

    const safeRawTeam = teamData?.rawTeam || {};

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

                        <h4 className="mb-0">Team Statistics</h4>
                        
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
                            {/* --- 🎯 Update Table Title with Matches Played --- */}
                            <h5>Per-Match Averages (Total Matches: {safeRawTeam.matches || 0})</h5>
                            
                            <table className="table table-striped table-hover">
                                <thead className="text-white bg-dark">
                                    <tr>
                                        <th>Stat</th>
                                        <th className="text-center">Team Actual Value (Raw Total)</th>
                                        <th className="text-center">Team Score Per Match (Average)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Matches is not listed here, but is used in calculations */}
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

            {/* --- Edit Team Stats Modal --- */}
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
                            <h5 className="fw-bold">Edit Team Statistics (Raw Totals)</h5>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={handleCancelEdit}
                                disabled={saving}
                            >
                                Close
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="text-white bg-dark">
                                    <tr>
                                        <th>Stat</th>
                                        <th className="text-center">Actual Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* --- 🎯 Matches Played Field Added Here --- */}
                                    <tr>
                                        <td className="fw-bold">Matches Played</td>
                                        <td className="text-center">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm text-center"
                                                value={editedData.matches || 0}
                                                onChange={(e) => {
                                                    let val = e.target.value;
                                                    // Allow only whole numbers for matches
                                                    val = val.replace(/[^0-9]/g, ""); 
                                                    handleInputChange('matches', val);
                                                }}
                                                min="0"
                                                step="1"
                                                disabled={saving}
                                                style={{ width: "120px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>

                                    {/* --- Other Stats (Mapped) --- */}
                                    {statLabels.map(({ key, label }) => (
                                        <tr key={key}>
                                            <td className="fw-semibold">{label}</td>
                                            <td className="text-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center"
                                                    value={editedData[key] || 0}
                                                    onChange={(e) => {
                                                        // Allows decimals for stats like Pass % (step="any")
                                                        let val = e.target.value; 
                                                        handleInputChange(key, val);
                                                    }}
                                                    min="0"
                                                    step="any"
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