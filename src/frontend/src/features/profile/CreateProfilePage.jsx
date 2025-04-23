import { useNavigate } from 'react-router-dom';
import commonStyles from '@/common/styles/Common.module.css';
import FormCard from '@/common/components/FormCard';
import formCard from '@/common/components/FormCard.module.css';
import local from './CreateProfilePage.module.css';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import {
	getNameValidationRules,
	validateFullDate,
} from '@/common/validation/profileValidation';
import cx from '@/utils/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const styles = { ...formCard, ...local };

function CreateProfilePage() {
	const navigate = useNavigate();

	const {
		control,
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		const dob = data.dob;
		if (dob) {
			const [day, month, year] = [dob.getDate(), dob.getMonth() + 1, dob.getFullYear()];
			const dateError = validateFullDate(day, month, year);
			if (dateError) {
				setError("dob", { type: "manual", message: dateError });
				return;
			}
		}
		console.log("Submitted:", data);
	};

	return (
		<div className={commonStyles.common__mainBackground}>
			<div className="create-profile-page-container">
				<FormCard title="Create Profile" className={styles.formCard}>
					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<div className={styles.formCard__form}>
							{/* Name Field */}
							<div className={cx("mb-3", styles.formCard__group)}>
								<label htmlFor="name">Name</label>
								<input
									id="name"
									type="text"
									placeholder="Enter name"
									className={styles.formCard__control}
									{...register("name", getNameValidationRules("Name"))}
								/>
								{errors.name && <span className={styles.error}>{errors.name.message}</span>}
							</div>

							{/* DOB Field */}
							<div className={cx("mb-3", styles.formCard__group)}>
								<label htmlFor="dob">Date of Birth</label>
								<Controller
									name="dob"
									control={control}
									defaultValue={null}
									rules={{
										required: "Date of birth is required",
										validate: (value) => {
											if (!value) return true;
											const [day, month, year] = [value.getDate(), value.getMonth() + 1, value.getFullYear()];
											return validateFullDate(day, month, year) || true;
										},
									}}
									render={({ field }) => (
										<DatePicker
											id="dob"
											placeholderText="DD/MM/YYYY"
											selected={field.value}
											onChange={(date) => field.onChange(date)}
											dateFormat="dd/MM/yyyy"
											className={cx(styles.formCard__control, styles.createProfilePage__dobFieldControl)}
											showMonthDropdown
											showYearDropdown
											dropdownMode="select"
											maxDate={new Date()}
											showPopperArrow={false}
										/>
									)}
								/>
								{errors.dob && <span className={styles.error}>{errors.dob.message}</span>}
							</div>
							<div className={cx("mb-3", styles.formCard__group)}>
								<label htmlFor="gender">Gender</label>
								<div className={styles.createProfilePage__genderRadio}>
									<input {...register("gender", { required: "Gender is required" })} type="radio" id="gender-man" value="Man" className={styles.createProfilePage__genderRadioBtn} />
									<label htmlFor="gender-man">Man</label>
									<br />
									<input {...register("gender", { required: "Gender is required" })} type="radio" id="gender-woman" value="Woman" className={styles.createProfilePage__genderRadioBtn} />
									<label htmlFor="gender-woman">Woman</label>
									<br />
									<input {...register("gender", { required: "Gender is required" })} type="radio" id="gender-other" value="Other" className={styles.createProfilePage__genderRadioBtn} />
									<label htmlFor="gender-other">Other</label>
								</div>
								{errors.gender && <span className={styles.error}>{errors.gender.message}</span>}
							</div>
							{/* Submit Button */}
							<div className={cx("mb-3", styles.formCard__group)}>
								<label htmlFor="sexuality">Gender</label>
								<div className={styles.createProfilePage__genderRadio}>
									<input {...register("sexuality", { required: "Gender is required" })} type="radio" id="gender-man" value="Man" className={styles.createProfilePage__genderRadioBtn} />
									<label htmlFor="sexuality-heterosexual">Heterosexual</label>
									<br />
									<input {...register("sexuality", { required: "Gender is required" })} type="radio" id="gender-woman" value="Woman" className={styles.createProfilePage__genderRadioBtn} />
									<label htmlFor="sexuality-homosexual">Homosexual</label>
									<br />
									<input {...register("sexuality", { required: "Gender is required" })} type="radio" id="gender-other" value="Other" className={styles.createProfilePage__genderRadioBtn} />
									<label htmlFor="sexuality-bisexual">Bisexual</label>
								</div>
								{errors.sexuality && <span className={styles.error}>{errors.sexuality.message}</span>}
							</div>
						</div>
						<button type="submit" className={styles.formCard_submitBtn}>Next</button>
					</form>
				</FormCard>
			</div>
		</div>
	);
}

export default CreateProfilePage;
