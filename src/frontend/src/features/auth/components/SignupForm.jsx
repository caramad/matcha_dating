import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Alert } from "react-bootstrap";
import style from './Form.module.css'

function SignupForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		console.log("Submitted:", data);
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)} noValidate >
			<div className={style.authForm__form}>
				<Form.Group controlId="formName" className={`mb-3 ${style.authForm__group}`}>
					<Form.Label>Name</Form.Label>
					<Form.Control className={style.authForm__control}
						type="text"
						placeholder="Enter name"
						isInvalid={!!errors.name}
						{...register("name", { required: "Name is required" })}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.name?.message}
					</Form.Control.Feedback>
				</Form.Group>

				<Form.Group controlId="formEmail" className={`mb-3 ${style.authForm__group}`}>
					<Form.Label>Email</Form.Label>
					<Form.Control className={style.authForm__control}
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

				<Form.Group controlId="formPassword" className={`mb-3 ${style.authForm__group}`}>
					<Form.Label>Password</Form.Label>
					<Form.Control className={style.authForm__control}
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

			<Button variant="primary" type="submit" className={style.authForm_submitBtn}>
				Create Account
			</Button>
		</Form>
	);
}

export default SignupForm;
