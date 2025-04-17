import React, { useState } from "react";
//import LoginFields from "./LoginFields";
//import SignupFields from "./SignupFields";
import Button from "react-bootstrap/Button";

function AuthForm({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'

  const handleToggle = () => {
	setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  const handleSubmit = async (formData) => {
  };

  return (
	<div className="auth-form-card">
	  <h2>{mode === "login" ? "Log In" : "Sign Up"}</h2>
	  <form onSubmit={(e) => e.preventDefault()}>
		{mode === "login" ? (
			<p> LOGIN </p>
			//<LoginFields onSubmit={handleSubmit} />
		) : (
			<p> SIGNUP </p>
			//<SignupFields onSubmit={handleSubmit} />
		)}
	  </form>
	  <div className="toggle-link">
		{mode === "login" ? (
		  <p>
			Don't have an account?{" "}
			<Button onClick={handleToggle} variant="link">Sign Up</Button>
		  </p>
		) : (
		  <p>
			Already have an account?{" "}
			<Button onClick={handleToggle} variant="link">Log In</Button>
		  </p>
		)}
	  </div>
	</div>
  );
}

export default AuthForm;
