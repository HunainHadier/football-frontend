// src/pages/Help/HelpGuide.jsx - Role-based Help Guide (Admin Priority Order)

import React, { useState } from "react"; 
import {
  FaUserPlus,
  FaEdit,
  FaUsers,
  FaChartLine,
  FaChartBar,
  FaRegFilePdf,
  FaEye,
  FaTimes, 
  FaUserShield,
  FaClipboardList, 
} from "react-icons/fa";

// Helper function to create the image source path
const getImagePath = (fileName) => `/images/help/${fileName}`;

// --- MOCK AUTH HOOK (No changes) ---
const useAuth = () => {
  const [role] = useState(() => {
    try {
      const storedRole = localStorage.getItem('role');
      return (storedRole === 'ADMIN' || storedRole === 'COACH') ? storedRole : 'COACH';
    } catch (error) {
      console.error("Error reading role from localStorage:", error);
      return 'COACH';
    }
  });
  return { role };
};
// --------------------------------------------------------------------------

// --- IMAGE MODAL COMPONENT (No changes) ---
const ImageModal = ({ imageUrl, altText, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div 
      className="modal d-block" 
      tabIndex="-1"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
        overflowY: 'auto', 
        zIndex: 1050 
      }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-xl modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-transparent border-0">
          <div className="modal-header border-0 p-2 d-flex justify-content-end">
            <button 
              type="button" 
              className="btn-close"
              style={{ filter: 'invert(1)', opacity: 1, backgroundColor: 'transparent' }}
              onClick={onClose}
              aria-label="Close"
            >
              <FaTimes color="white" size={24} />
            </button>
          </div>
          <div className="modal-body p-0">
            <img 
              src={imageUrl} 
              alt={altText} 
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
            />
            <small className="d-block text-center mt-1 text-white">{altText || 'Click to close'}</small>
          </div>
        </div>
      </div>
    </div>
  );
};
// -------------------------------------------

// --- HELPCARD COMPONENT (No changes) ---
const HelpCard = ({ icon, title, children, imageFileName = null, altText = "", setModalImage }) => (
  <div className="card shadow-sm border-0 h-100">
    <div className="card-body">
      <div className="d-flex align-items-center mb-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{ width: 50, height: 50, background: "rgba(33, 150, 243, 0.1)" }}
        >
          {icon}
        </div>
        <h5 className="fw-semibold mb-0">{title}</h5>
      </div>
      
      {imageFileName && (
        <div 
          className="mb-3 border rounded p-2 bg-light cursor-pointer"
          onClick={() => setModalImage({ src: getImagePath(imageFileName), alt: altText })}
          style={{ cursor: 'pointer' }} 
        >
          <img 
            src={getImagePath(imageFileName)} 
            alt={altText || `Screenshot of ${title} feature`} 
            style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
          />
          <small className="d-block text-center mt-1 text-primary">Click to Zoom</small>
        </div>
      )}
      
      <ul className="text-muted small ps-3">{children}</ul>
    </div>
  </div>
);
// -----------------------------------------------------

// --- PLAYER SECTIONS (Coach ke liye full access, Admin ke liye View Only) ---
const PlayerSections = ({ setModalImage, role }) => {
    const isCoach = role === 'COACH';
    const isEditAllowed = isCoach;

    return (
        <>
            {/* SECTION 1 (Admin/Coach) — Player Management (CRUD for Coach, View for Admin) */}
            <div className="row g-4">
                <div className="col-lg-12">
                    <h4 className="mb-3 text-primary">
                        <FaUsers className="me-2" /> 
                        {isCoach ? '1. Managing Players (Add, Edit, Delete)' : '5. Player Management (View Only)'}
                    </h4>
                    <div className="row g-4">
                        
                        {/* 1.1 Add Player (Only for Coach) */}
                        {isEditAllowed && (
                            <div className="col-md-4">
                                <HelpCard
                                    setModalImage={setModalImage}
                                    icon={<FaUserPlus className="text-success fs-4" />}
                                    title="Add a New Player"
                                    imageFileName={"addplayer.png"} 
                                    altText="Player Management screen showing the 'ADD PLAYER' modal."
                                >
                                    <li>
                                        On the **Players Management** screen, click the **'ADD PLAYER'** button.
                                    </li>
                                    <li>
                                        The **'Add Player'** modal will open, prompting for **Name**, **Email**, and **Age**.
                                    </li>
                                    <li>
                                        Fill in the details and click **'ADD PLAYER'** to save the new entry.
                                    </li>
                                </HelpCard>
                            </div>
                        )}

                        {/* 1.2 View/Edit/Delete Player (Admin can only View) */}
                        <div className={`col-md-${isEditAllowed ? 4 : 6}`}>
                            <HelpCard
                                setModalImage={setModalImage}
                                icon={<FaEye className="text-info fs-4" />}
                                title={`View Player Profile${isEditAllowed ? ' (Edit/Delete available)' : ''}`}
                                imageFileName={"playermanagement.png"} 
                                altText="Player table showing the dropdown menu with View Profile, Edit, Delete options."
                            >
                                <li>
                                    In the Players table, click the dropdown menu under the **Actions** column for any player.
                                </li>
                                <li>
                                    Click **'View Profile'** to see the dedicated profile screen, which includes **Player Information** and **Overall Behavior Score**.
                                </li>
                                {isEditAllowed && (
                                    <li>
                                        **Coach Only:** Use **'Edit'** or **'Delete'** from the dropdown to modify or remove the player record.
                                    </li>
                                )}
                            </HelpCard>
                        </div>

                        {/* 1.3 Create Team & Send Evaluation (Only for Coach) */}
                        {isEditAllowed && (
                            <div className="col-md-4">
                                <HelpCard
                                    setModalImage={setModalImage}
                                    icon={<FaUsers className="text-warning fs-4" />}
                                    title="Manage Teams and Send Evaluations"
                                    imageFileName={"playermanagment.png"} 
                                    altText="Player Management screen showing selected player checkbox and CREATE TEAM / GENERATE TRAITS buttons."
                                >
                                    <li>
                                        Select players by clicking the checkbox next to their S.No..
                                    </li>
                                    <li>
                                        Click **'CREATE TEAM'** to form a new team with the selected players.
                                    </li>
                                    <li>
                                        Click **'GENERATE TRAITS'** to initiate the behavioral trait evaluation process.
                                    </li>
                                    <li>
                                        To add more players to an existing team, go to the team page and click **'ADD MORE PLAYERS'**.
                                    </li>
                                </HelpCard>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>

            <hr className="my-4"/>

            {/* SECTION 2 (Admin/Coach) — Player Statistics */}
            <div className="row g-4">
                <div className="col-lg-12">
                    <h4 className="mb-3 text-success">
                        <FaChartLine className="me-2" /> 
                        {isCoach ? '2. Player Statistics & Comparison' : '6. Player Statistics & Comparison'}
                    </h4>
                    <div className="row g-4">
                        
                        {/* 2.1 Add/Edit Player Statistics (Only for Coach) */}
                        {isEditAllowed && (
                            <div className={`col-md-${isEditAllowed ? 6 : 12}`}>
                                <HelpCard
                                    setModalImage={setModalImage}
                                    icon={<FaChartLine className="text-success fs-4" />}
                                    title="Add/Edit Player Statistics (Coach Only)"
                                    imageFileName={"Addplayerstats.png"} 
                                    altText="Screen to add new player statistics like Matches, Goals, Assists, etc."
                                >
                                    <li>
                                        The **'Add Player Statistics'** screen allows input for various stats like **Goals (G)**, **Matches (M)**, **Assists (A)**, etc.
                                    </li>
                                    <li>
                                        To modify existing stats, navigate to the Player Comparison page and click the **'EDIT STATS'** button.
                                    </li>
                                </HelpCard>
                            </div>
                        )}

                        {/* 2.2 View Player vs Team Comparison (For both Admin and Coach) */}
                        <div className={`col-md-${isEditAllowed ? 6 : 12}`}>
                            <HelpCard
                                setModalImage={setModalImage}
                                icon={<FaChartBar className="text-danger fs-4" />}
                                title="View Player vs Team Comparison"
                                imageFileName={"viewplayercomparision.png"} 
                                altText="Player Stats modal showing a stats entry and a 'VIEW' button."
                            >
                                <li>
                                    From the Player Profile, click the **'View Player Stats'** button.
                                </li>
                                <li>
                                    Click **'VIEW'** inside the modal next to a stats entry to access the **Player vs Team Comparison** screen.
                                </li>
                                <li>
                                    This screen shows **Per-Match Averages** and the **Player Contribution** compared to the Team Score.
                                </li>
                            </HelpCard>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="my-4"/>

            {/* SECTION 3 (Admin/Coach) — Behavioral Traits (For both Admin and Coach) */}
            <div className="col-lg-12">
                <h4 className="mb-3 text-info">
                    <FaRegFilePdf className="me-2" /> 
                    {isCoach ? '3. Behavioral Traits and Reports' : '7. Behavioral Traits and Reports'}
                </h4>
                <div className="row g-4">
                    
                    {/* 3.1 View Competency Radar Chart */}
                    <div className="col-md-6">
                        <HelpCard
                            setModalImage={setModalImage}
                            icon={<FaEye className="text-info fs-4" />}
                            title="View Competency Radar Chart"
                            imageFileName={"competancyradarchart.png"} 
                            altText="Modal displaying the Competency Radar Chart for a player's behavior."
                        >
                            <li>
                                On the Player's Profile, click the **'View Behaviour Traits'** button.
                            </li>
                            <li>
                                This opens a modal displaying the **Competency Radar Chart**, which visualizes the Player Behavior Overall Score.
                            </li>
                        </HelpCard>
                    </div>

                    {/* 3.2 Export Behavior Trait Report (PDF) */}
                    <div className="col-md-6">
                        <HelpCard
                            setModalImage={setModalImage}
                            icon={<FaRegFilePdf className="text-danger fs-4" />}
                            title="Export Behavior Trait Report (PDF)"
                            imageFileName={"behaviraltreatmodal.png"} 
                            altText="Modal showing the Football Player Behavior Trait Map and a 'DOWNLOAD REPORT' button."
                        >
                            <li>
                                Navigate to the Player Evaluations screen (via Player Profile).
                            </li>
                            <li>
                                Click **'Export'** next to a Date entry.
                            </li>
                            <li>
                                A modal will display the behavior trait map, and you can click **'DOWNLOAD REPORT'** to generate the PDF report.
                            </li>
                        </HelpCard>
                    </div>
                </div>
            </div>
        </>
    );
};
// ----------------------------------------------------------------------------------

// --- ADMIN SPECIFIC SECTIONS ---
const AdminSections = ({ setModalImage }) => (
  <>
  

    {/* SECTION 4.1 — Coach Management (Admin Only - Add/Edit) */}
    <div className="row g-4">
      <div className="col-lg-12">
        <h4 className="mb-3 text-secondary">
          <FaEdit className="me-2" /> 1. Coach Management (Add/Edit)
        </h4>
        <div className="row g-4">

          {/* 4.1.1 Add Coach */}
          <div className="col-md-6">
            <HelpCard
              setModalImage={setModalImage}
              icon={<FaUserPlus className="text-success fs-4" />}
              title="Add a New Coach"
              imageFileName={"addcoaches.png"} 
              altText="Coaches screen showing the 'ADD COACH' button."
            >
              <li>
                On the **Coaches** management screen, click the **'+ ADD COACH'** button.
              </li>
              <li>
                The **'Add Coach'** modal will open, prompting for **Full Name**, **Username**, **Email**, **Region**, and **Password**.
              </li>
              <li>
                Fill in the details and click **'CREATE COACH'**.
              </li>
            </HelpCard>
          </div>

          {/* 4.1.2 Edit Coach */}
          <div className="col-md-6">
            <HelpCard
              setModalImage={setModalImage}
              icon={<FaEdit className="text-secondary fs-4" />}
              title="Edit Coach Details"
              imageFileName={"editcoach.png"} 
              altText="Screen showing the list of coaches and the 'Edit' action button."
            >
              <li>
                In the Coaches list, click the **'Edit'** button under the Actions column for any coach.
              </li>
              <li>
                The **'Edit Coach'** modal will open, allowing you to modify their details and change the **Account Active** status.
              </li>
              <li>
                Leave the **New Password** field blank to keep the current password.
              </li>
            </HelpCard>
          </div>
        </div>
      </div>
    </div>

    <hr className="my-4"/>
    
    {/* SECTION 4.2 — Team Management (Admin Only - View Stats) */}
    <div className="row g-4">
      <div className="col-lg-12">
        <h4 className="mb-3 text-info">
          <FaClipboardList className="me-2" /> 2. Team Management (View Players/Stats)
        </h4>
        <div className="row g-4">
          
          {/* 4.2.1 View Team Players and Stats */}
          <div className="col-md-6">
            <HelpCard
              setModalImage={setModalImage}
              icon={<FaUsers className="text-info fs-4" />}
              title="View Team Players and Statistics"
              imageFileName={"viewteamplayer.png"} 
              altText="Team Management screen showing options to View Players and View Stats."
            >
              <li>
                In the Teams Management list, for any team, click **'VIEW PLAYERS'** to see the list of players in that team.
              </li>
              <li>
                Click **'VIEW STATS'** to see the overall **Team Statistics**, including **Team Actual Value** and **Team Score Per Match**.
              </li>
            </HelpCard>
          </div>
          
           {/* 4.2.2 Team vs Player Comparison (Admin Only - View) */}
          <div className="col-md-6">
            <HelpCard
              setModalImage={setModalImage}
              icon={<FaChartBar className="text-danger fs-4" />}
              title="View Team vs Player Comparison"
              imageFileName={"playerteamcomparision.png"} 
              altText="Team vs Player Comparison screen showing a detailed comparison chart."
            >
              <li>
                **Team Stats** देखने के बाद, team members की तुलना देखने के लिए **'VIEW COMPARISON'** बटन पर क्लिक करें।
              </li>
              <li>
                यह स्क्रीन **Team** के औसत (average) प्रदर्शन की तुलना **individual players** के प्रदर्शन से करती है।
              </li>
            </HelpCard>
          </div>
        </div>
      </div>
    </div>
    
     <hr className="my-4"/>

    <div className="alert alert-info my-4">
      <h5 className="fw-bold mb-0"><FaEye className="me-2" /> Player Sections (View Only)</h5>
      <p className="mb-0 small">Sections 5, 6, और 7 में, Admin केवल **View** कर सकते हैं, **Edit/Add** नहीं।</p>
    </div>
  </>
);
// --------------------------------------------------------------------------

// --- MAIN COMPONENT ---
const PlayerManagementHelpGuide = () => {
  const { role } = useAuth();
  const [modalImage, setModalImage] = useState(null); 

  const isCoach = role === 'COACH';
  const isAdmin = role === 'ADMIN';
  
  // Admin के लिए Priority Order: 
  // 1. AdminSections (Coach/Team Management)
  // 2. PlayerSections (Players/Stats/Traits - View Only)
  // Coach के लिए Priority Order:
  // 1. PlayerSections (Players/Stats/Traits - Full Access)

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      
      {/* Image Modal ko render karein */}
      {modalImage && (
        <ImageModal
          imageUrl={modalImage.src}
          altText={modalImage.alt}
          onClose={() => setModalImage(null)}
        />
      )}

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="h3 fw-bold text-primary">
           {isAdmin ? 'Admin' : 'Coach'} Help Guide: Player Management System
        </h1>
        <p className="text-muted">
          Welcome! This guide explains the functions available to the **{role}** role.
        </p>
      </div>

      {/* ADMIN-SPECIFIC SECTIONS - Admin के लिए Coach Management (Section 1, 2) पहले aayega */}
      {isAdmin && <AdminSections setModalImage={setModalImage} />}

      {/* COACH/PLAYER SECTIONS - Player Management (Section 1, 2, 3) Coach/Admin dono ko dikhega */}
      {/* Admin के लिए इनकी Heading numbers 5, 6, 7 हो जाएँगी, और Coach के लिए 1, 2, 3 रहेंगी। */}
      <PlayerSections setModalImage={setModalImage} role={role} />

      {/* Footer Note */}
      <div className="alert alert-info mt-4 d-flex align-items-center gap-2">
        <i className="feather-info fs-5"></i>
        <span>
          **Note:** This guide dynamically adjusts based on the **{role}** role to show only the relevant features.
        </span>
      </div>
    </div>
  );
};

export default PlayerManagementHelpGuide;