import { useNavigate } from 'react-router-dom';
import commonStyles from '@/common/styles/Common.module.css';
import FormCard from '@/common/components/FormCard';
import DoubleRangeSlider from '@/common/components/DoubleRangeSlider';
import formCardStyles from '@/common/components/FormCard.module.css';
import createProfilePageStyles from './CreateProfilePage.module.css';
import { Form, Button, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import React from 'react';
import { useForm } from "react-hook-form";
import { getNameValidationRules } from '@/common/validation/profileValidation'

function CreateProfilePage() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		console.log("Submitted:", data);
	};

	return (
		<div className={commonStyles.common__mainBackground}>
			<div className="create-profile-page-container">
				<FormCard title="Create Profile" className={createProfilePageStyles.formCard} >
					<Form onSubmit={handleSubmit(onSubmit)} noValidate >
						<div className={formCardStyles.formCard__form}>
							<Form.Group controlId="name" className={`mb-3 ${formCardStyles.formCard__group}`}>
								<Form.Label>Name</Form.Label>
								<Form.Control className={formCardStyles.formCard__control}
									type="text"
									placeholder="Enter name"
									isInvalid={!!errors.firstName}
									{...register("name", getNameValidationRules("Name"))}
								/>
							</Form.Group>
						</div>
						<div className={formCardStyles.formCard__form}>
							<Form.Group controlId="name" className={`mb-3 ${formCardStyles.formCard__group}`}>
									<h2>Select a Range:</h2>
									<DoubleRangeSlider
										min={18}
										max={100}
										step={1}
										minRange={4}
									/>
							</Form.Group>
						</div>
					</Form>
				</FormCard>
			</div>
		</div>
	);
}

export default CreateProfilePage;