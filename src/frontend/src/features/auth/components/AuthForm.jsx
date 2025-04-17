import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import styles from './AuthForm.module.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuthMode } from "../hooks/useAuthMode";

function AuthForm({ initialMode = "login" }) {
	const { mode, toggleMode } = useAuthMode(initialMode);

	return (
		<div className={styles.auth__background}>
			<div className={styles.authFormCard}>
				<h2 className={styles.authFormCard__title}>
					{mode === "login" ? "Log In" : "Sign Up"}
				</h2>

				<div className={styles.authFormCard__form}>
					{mode === "login" ? (
						<>
							<LoginForm toggleMode={toggleMode} />
						</>
					) : (
						<>
							<SignupForm toggleMode={toggleMode} />
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default AuthForm;
