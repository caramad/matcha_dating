import React from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Form, Button, Alert } from "react-bootstrap";
import styles from './AuthForm.module.css'

function SignupForm({ toggleMode }) {
	const navigate = useNavigate();
	
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm({
		mode: "onChange",
	});

	const onSubmit = async (data) => {
		console.log("Submitted:", data);
	};

	return (
		<>
			<Form onSubmit={handleSubmit(onSubmit)} noValidate >
				<div className={styles.authForm__form}>
					<Form.Group controlId="formEmail" className={`mb-3 ${styles.authForm__group}`}>
						<Form.Label>Email</Form.Label>
						<Form.Control className={styles.authForm__control}
							type="email"
							placeholder="Enter email"
							isInvalid={!!errors.email}
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: "Enter a valid email",
								},
							})}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.email?.message}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group controlId="formPassword" className={`mb-3 ${styles.authForm__group}`}>
						<Form.Label>Password</Form.Label>
						<Form.Control
							className={styles.authForm__control}
							type="password"
							placeholder="Password"
							isInvalid={!!errors.password}
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 8,
									message: "Password must be at least 8 characters",
								},
								maxLength: {
									value: 50,
									message: "Password must be at most 50 characters",
								},
							})}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.password?.message}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group controlId="formConfirmPassword" className={`mb-3 ${styles.authForm__group}`}>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							className={styles.authForm__control}
							type="password"
							placeholder="Confirm Password"
							isInvalid={!!errors.confirmPassword}
							{...register("confirmPassword", {
								required: "Please confirm your password",
								validate: (value) =>
									value === watch("password") || "Passwords do not match",
							})}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.confirmPassword?.message}
						</Form.Control.Feedback>
					</Form.Group>

				</div>

				<Button variant="primary" type="submit" disabled={!isValid} onClick={() => navigate('/create-profile')} className={styles.authForm_submitBtn}>
					Create Account
				</Button>
			</Form>

			<div>
				<p>
					Already have an account?{" "}
					<Button onClick={toggleMode} variant="link" className={styles.authFormCard__toggle}>Log In</Button>
				</p>
			</div>
		</>
	);
}

export default SignupForm;
