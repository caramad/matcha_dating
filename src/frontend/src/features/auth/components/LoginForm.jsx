import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Alert } from "react-bootstrap";
import styles from './AuthForm.module.css'

function LoginForm({ toggleMode }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

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
						<Form.Control className={styles.authForm__control}
							type="password"
							placeholder="Password"
							isInvalid={!!errors.password}
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 6,
									message: "Password must be at least 6 characters",
								},
							})}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.password?.message}
						</Form.Control.Feedback>
					</Form.Group>
				</div>


				<Button variant="primary" type="submit" className={styles.authForm_submitBtn}>
					Login
				</Button>
			</Form>

			<div>
				<p>
					Don't have an account?{" "}
					<Button onClick={toggleMode} variant="link" className={styles.authFormCard__toggle}>Sign Up</Button>
				</p>
			</div>
		</>
	);
}

export default LoginForm;
