import React from "react";

const PlayervsTeamComparison = ({
  open,
  onClose,
  comparisonData,
  loadingComparison,
  statLabels,
  getPercentageDiff,
  getDiffColor,
}) => {
  if (!open) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 4000 }}
    >
      <div
        className="bg-white p-4 rounded shadow"
        style={{ width: "90%", maxWidth: 1200, maxHeight: "85vh", overflowY: "auto" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold">Player vs Team Comparison</h5>

          <button className="btn btn-sm btn-danger" onClick={onClose}>
            Close
          </button>
        </div>

        {loadingComparison ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : comparisonData ? (
          <div className="table-responsive mb-4">
            <h6>Per-Match Averages</h6>

            <table className="table table-striped table-hover">
              <thead className="text-white bg-dark">
                <tr>
                  <th>Stat</th>
                  <th className="text-center">Actual Player Value</th>
                  <th className="text-center">Player Avg</th>
                  <th className="text-center">Team Avg</th>
                  <th className="text-center">Difference (%)</th>
                </tr>
              </thead>

              <tbody>
                {statLabels.map(({ key, label }) => {
                  const rawPlayerVal = parseFloat(comparisonData.rawPlayer[key] || 0);
                  const playerAvg = parseFloat(comparisonData.player[key] || 0);
                  const teamAvg = parseFloat(comparisonData.team[key] || 0);
                  const diff = getPercentageDiff(playerAvg, teamAvg);

                  return (
                    <tr key={key}>
                      <td className="fw-semibold">{label}</td>
                      <td className="text-center">{rawPlayerVal}</td>
                      <td className="text-center">{playerAvg.toFixed(2)}</td>
                      <td className="text-center">{teamAvg.toFixed(2)}</td>

                      <td className={`text-center fw-bold ${getDiffColor(diff)}`}>
                        {diff > 0 ? "+" : ""}
                        {diff}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        ) : (
          <div className="alert alert-warning">No comparison data</div>
        )}
      </div>
    </div>
  );
};

export default PlayervsTeamComparison;
