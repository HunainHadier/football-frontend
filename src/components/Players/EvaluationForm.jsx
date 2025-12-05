import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// API functions (unchanged)
const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const apiGetQuestions = async (region) => {
  const res = await fetch(
    `${BASE_URL}/api/player/evaluations/questions?region=${region}`
  );

  if (!res.ok) throw new Error("Failed to load questions");
  return res.json();
};

const apiSubmitEvaluation = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/player/evaluations/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to submit evaluation");
  return res.json();
};

const EvaluationForm = () => {
  const [params] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Get region from URL path (last part)
  const urlPath = window.location.pathname; // "/coach/evaluations/africa"
  const region = urlPath.split("/").pop(); // "africa"

  const playerId = params.get("player"); // ?player=6
  const coachId = params.get("coach") || 0; // optional


  // const navigate = useNavigate(); // Not used in this version after success message change

  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState([]);
  const [answers, setAnswers] = useState({});
  const [comment, setComment] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const token = params.get("token");


  useEffect(() => {
    const verifyToken = async () => {
      if (!playerId || !token) {
        setError("Invalid evaluation link.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${BASE_URL}/api/public/verify?player=${playerId}&token=${token}`
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Invalid or expired evaluation link.");
          setLoading(false);
          return;
        }

      } catch (err) {
        setError("Failed to verify link.");
        setLoading(false);
        return;
      }
    };

    verifyToken();
  }, [playerId, token]);

  // ===============================
  // LOAD QUESTIONS + CHOICES
  // ===============================
  useEffect(() => {
    // console.log("Region:", region); // Remove console logs in final code
    // console.log("Player ID:", playerId); // Remove console logs in final code

    const loadAll = async () => {
      try {
        setLoading(true);
        setError("");

        const q = await apiGetQuestions(region);

        setQuestions(q.questions || []);
        setChoices(q.choices || []);

        // prepare answers object
        const ans = {};
        (q.questions || []).forEach((x) => {
          ans[x.q_id] = null;
        });

        setAnswers(ans);
      } catch (err) {
        console.error("Load Error:", err);
        setError(
          "Failed to load evaluation form. Please check URL or network connection."
        );
      } finally {
        setLoading(false);
      }
    };

    // Load only when region + playerId exist
    if (region && playerId) {
      loadAll();
    } else {
      setLoading(false);
      setError("Missing region or player ID in URL.");
    }
  }, [region, playerId]);

  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.values(answers).filter((x) => x !== null).length;
  const progressPercentage = total > 0 ? (answeredCount / total) * 100 : 0;

  // ===============================
  // UI States (Loading, Error, No Questions)
  // ===============================

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="card p-5 text-center shadow">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fs-5 text-primary">Loading evaluation form...</p>
          <small className="text-muted">
            Player ID: **{playerId || "N/A"}** | Region: **{region || "N/A"}**
          </small>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger p-4 shadow-sm" role="alert">
          <h4 className="alert-heading">🚫 Error Loading Form</h4>
          <p>
            Error: {error}
          </p>
          <hr />
     
        </div>
      </div>
    );
  }

  if (!currentQuestion && !submitted) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning p-4 shadow-sm" role="alert">
          <h4 className="alert-heading">⚠️ No Questions Found</h4>
          <p className="mb-0">
            Invalid evaluation link or no questions available for this region.
          </p>
        </div>
      </div>
    );
  }

  // ===============================
  // Handlers
  // ===============================

  const handleSelectChoice = (qId, val) => {
    setAnswers((prev) => ({ ...prev, [qId]: Number(val) }));
  };

  const isLast = currentIndex === total - 1;
  const allAnswered = Object.values(answers).every((x) => x !== null);

  const handleSubmit = async () => {
    // Check if the current question has been answered before submitting
    if (answers[currentQuestion.q_id] === null) {
      alert("Please answer the current question before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      await apiSubmitEvaluation({
        player_id: Number(playerId),
        coach_id: Number(coachId),
        region,
        answers,
        comment,
        token,
      });

      setSuccessMessage("Your evaluation has been submitted successfully!");
      setSubmitted(true); // show success view
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Failed to submit evaluation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ===============================
  // Success View
  // ===============================

  if (submitted) {
    return (
      <div className="container mt-5">
        <div className="card shadow-lg border-0 p-5 text-center bg-light">
          <div className="display-4 text-success mb-3">✅</div>
          <h2 className="text-dark mb-3">Thank You for Your Time!</h2>
          <p className="lead text-success fw-bold">{successMessage}</p>
          <p className="text-muted mt-2">
            The player evaluation for Player ID **{playerId}** (Region: **{region}**) has been recorded.
          </p>
        
        </div>
      </div>
    );
  }

  // ===============================
  // Main Form View
  // ===============================

  return (
    <div className="container my-5">
      <div
        className="card shadow-lg border-0 p-0"
        style={{ maxWidth: "800px", margin: "0 auto", borderRadius: "10px" }}
      >
        <div className="card-header bg-primary text-white p-3 rounded-top">
          <h4 className="mb-1 fw-bold">Player Evaluation Form</h4>

        </div>

        <div className="card-body p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <h6 className="text-muted mb-1">
              Question {currentIndex + 1} of {total}
            </h6>
            <div className="progress" style={{ height: "10px" }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={answeredCount}
                aria-valuemin="0"
                aria-valuemax={total}
              ></div>
            </div>
            <small className="text-muted float-end mt-1">
              {answeredCount}/{total} Answered
            </small>
          </div>

          <div className="clearfix"></div> {/* Clear float */}

          {/* QUESTION */}
          <div className="p-3 border rounded mb-4 bg-light">
            <h5 className="mb-0 fw-semibold text-dark">
              {currentQuestion.q_order}. {currentQuestion.q_text}
            </h5>
          </div>

          {/* CHOICES */}
          <div className="choice-list">
            {choices.map((c) => {
              const isSelected = answers[currentQuestion.q_id] === c.choice_value;
              return (
                <label
                  key={c.choice_value}
                  className={`d-block p-3 border rounded mb-3 shadow-sm ${isSelected ? "bg-info text-white border-info" : "bg-white hover-bg-light"
                    }`}
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                >
                  <input
                    type="radio"
                    name={`q_${currentQuestion.q_id}`}
                    value={c.choice_value}
                    checked={isSelected}
                    onChange={(e) =>
                      handleSelectChoice(currentQuestion.q_id, e.target.value)
                    }
                    className="form-check-input me-3"
                    style={{ transform: "scale(1.2)" }}
                  />
                  <span className={`${isSelected ? 'fw-bold' : 'text-dark'}`}>
                    {c.choice_text}
                  </span>
                </label>
              );
            })}
          </div>

          {/* COMMENT FIELD (only last question) */}
          {isLast && (
            <div className="mt-4 pt-3 border-top">
              <label htmlFor="commentsTextarea" className="form-label fw-bold">
                Additional Comments (Optional):
              </label>
              <textarea
                id="commentsTextarea"
                className="form-control"
                placeholder="Enter any additional feedback here..."
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          )}

          {/* BUTTONS */}
          <div className="d-flex justify-content-between mt-5">
            {/* Previous Button */}
            <button
              className="btn btn-secondary px-4"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
            >
              &larr; Previous
            </button>

            {/* Next / Submit Button */}
            {!isLast ? (
              <button
                className="btn btn-primary px-5"
                disabled={answers[currentQuestion.q_id] === null}
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                Next &rarr;
              </button>
            ) : (
              <button
                className="btn btn-success px-5"
                disabled={!allAnswered || submitting || answers[currentQuestion.q_id] === null}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Evaluation"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;