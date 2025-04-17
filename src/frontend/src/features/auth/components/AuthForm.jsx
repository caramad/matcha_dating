import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import styles from './AuthForm.module.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

function AuthForm({ initialMode = "login" }) {
	const [mode, setMode] = useState(initialMode);
	const navigate = useNavigate();

	const handleToggle = () => {
		const newMode = mode === "login" ? "signup" : "login";
		setMode(newMode);
		navigate(`?mode=${newMode}`, { replace: true });
	};

	return (
		<div className={styles.auth__background}>
			<div className={styles.authFormCard}>
				<h2 className={styles.authFormCard__title}>
					{mode === "login" ? "Log In" : "Sign Up"}
				</h2>

				<div className={styles.authFormCard__form}>
					{mode === "login" ? (
						<>
							<LoginForm />
						</>
					) : (
						<>
							<SignupForm />
						</>
					)}
				</div>

				<div>
					{mode === "login" ? (
						<p>
							Don't have an account?{" "}
							<Button onClick={handleToggle} variant="link" className={styles.authFormCard__toggle}>Sign Up</Button>
						</p>
					) : (
						<p>
							Already have an account?{" "}
							<Button onClick={handleToggle} variant="link" className={styles.authFormCard__toggle}>Log In</Button>
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default AuthForm;
