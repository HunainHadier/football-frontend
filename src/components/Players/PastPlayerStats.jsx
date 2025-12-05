
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

// const PastPlayerStats = () => {
//   const { id: playerId } = useParams();
//   const [latestStat, setLatestStat] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadLatestStat();
//   }, []);

//   const loadLatestStat = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const res = await fetch(`${BASE_URL}/api/coach/stats/list/${playerId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const json = await res.json();
//       if (!res.ok) throw new Error(json.message || "Failed to load");

//       // 👇 Latest entry only
//       setLatestStat(json.stats && json.stats.length > 0 ? json.stats[0] : null);
//     } catch (err) {
//       setError(err.message || "Failed to load list");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewComparison = () => {
//     // Direct navigate to comparison page
//     navigate(`/player-comparison/${playerId}`);
//   };

//   return (
//     <div className="container py-4">
//       <h4>Player Stat</h4>

//       {error && <div className="alert alert-danger">{error}</div>}

//       {loading ? (
//         <div className="spinner-border text-primary" />
//       ) : latestStat ? (
//         <div className="card">
//           <div className="card-body p-0">
//             <table className="table m-0">
//               <thead className="table-light">
//                 <tr>
//                   <th>#</th>
//                   <th>Match </th>
//                   <th>Date</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>1</td>
//                   <td>{latestStat.year}</td>
//                   <td>{new Date(latestStat.created_at).toLocaleString()}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       onClick={handleViewComparison}
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="alert alert-warning">No stats found</div>
//       )}
//     </div>
//   );
// };

// export default PastPlayerStats;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const PastPlayerStats = () => {
  const { id: playerId } = useParams();
  const [latestStat, setLatestStat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadLatestStat();
  }, []);

  const loadLatestStat = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${BASE_URL}/api/coach/stats/list/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load");

      // Take only latest stat
      setLatestStat(json.stats?.length > 0 ? json.stats[0] : null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewComparison = () => {
    navigate(`/player-comparison/${playerId}`);
  };

  return (
    <div className="container py-4">
      <h4>Player Stats</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="spinner-border text-primary" />
      ) : latestStat ? (
        <div className="card">
          <div className="card-body p-0">
            <table className="table m-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Year</th>
                  <th>Matches</th>
               
                  <th>Created At</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>{latestStat.year}</td>
                  <td>{latestStat.matches}</td>
                
                  <td>{new Date(latestStat.created_at).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={handleViewComparison}
                    >
                      View
                    </button>
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">No stats found</div>
      )}
    </div>
  );
};

export default PastPlayerStats;
