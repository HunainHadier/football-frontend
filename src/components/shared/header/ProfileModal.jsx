import React, { useEffect, useState } from "react";
import { FiLogOut, FiBookOpen } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProfileModal = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleHowToUse = () => {
    navigate("/howtouse");
  };

  return (
    <div className="dropdown nxl-h-item">

      {/* AVATAR (NO IMAGE, ONLY INITIAL LETTER) */}
      <div
        data-bs-toggle="dropdown"
        role="button"
        data-bs-auto-close="outside"
        className="d-flex align-items-center justify-content-center me-0"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          fontWeight: "700",
          fontSize: "16px",
          cursor: "pointer",
          userSelect: "none"
        }}
      >
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>

      {/* DROPDOWN MENU */}
      <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown shadow-sm">

        <div className="dropdown-header py-3 px-3 border-bottom text-center">
          <h6
            className="mb-0 text-center"
            style={{
              color: "#111827",
              fontWeight: 800,       // stronger bold
              fontSize: "16px",      // slightly bigger
              letterSpacing: "0.5px"
            }}
          >
            {user ? `${user.username || ""} ${user.last_name || ""}` : "Guest User"}
          </h6>

          {user && (
            <span
              className="fs-12 fw-medium text-muted text-center"
              style={{
                color: "#111827",
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.5px",
                textAlign: "center",
              }}
            >
              {user.email}
            </span>
          )}

        </div>

        {/* HOW TO USE */}
        <button onClick={handleHowToUse} className="dropdown-item py-2">
          <i><FiBookOpen /></i>
          <span>How to Use</span>
        </button>

        {/* LOGOUT */}
        {/* <button onClick={handleLogout} className="dropdown-item py-2 text-danger">
          <i><FiLogOut /></i>
          <span>Logout</span>
        </button> */}

        {token && (
          <button onClick={handleLogout} className="dropdown-item py-2 text-danger">
            <i><FiLogOut /></i>
            <span>Logout</span>
          </button>
        )}

      </div>
    </div>
  );
};

export default ProfileModal;
