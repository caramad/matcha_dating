import React from "react";
import { useSearchParams } from "react-router-dom";
import AuthForm from "./components/AuthForm";

function AuthPage() {
	const [params] = useSearchParams();
	const initialMode = params.get("mode") === "signup" ? "signup" : "login";

	return (
		<div className="auth-page-container">
			<AuthForm initialMode={initialMode} />
		</div>
	)
}

export default AuthPage;