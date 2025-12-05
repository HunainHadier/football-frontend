import React from "react";
import LoginForm from "@/components/authentication/LoginForm";

const LoginCover = () => {
  return (
    <main
      className="d-flex flex-column flex-md-row"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f5f6fa",
      }}
    >
      {/* LEFT IMAGE (Hides on mobile) */}
      <div
        className="d-none d-md-flex"
        style={{
          width: "50%",
          height: "100vh",
          padding: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/images/auth/soccer-ball-net.jpg"
          alt="Soccer ball"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        />
      </div>

      {/* RIGHT LOGIN FORM */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "40px 20px",
          background: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px", margin: "0 auto" }}>
          <LoginForm
            registerPath="/register"
            resetPath="/authentication/reset/cover"
          />
        </div>
      </div>
    </main>
  );
};

export default LoginCover;
