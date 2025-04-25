import { useNavigate } from 'react-router-dom';
import commonStyles from '@/common/styles/Common.module.css';
import FormCard from '@/common/components/FormCard';
import InterestTagSearch from '@/common/components/InterestTagSearch';
import addInterestsPageStyles from './AddInterestsPage.module.css';
import formCardStyles from '@/common/components/FormCard.module.css';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import cx from '@/utils/utils';

const styles = { ...formCardStyles, ...addInterestsPageStyles };

function AddInterestsPage() {
	const navigate = useNavigate();
	const [selectedTags, setSelectedTags] = React.useState([]);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Submitted tags:", selectedTags);
		navigate("/");
		// TODO: backend
	};

	return (
		<div className={commonStyles.common__mainBackground}>
			<form onSubmit={handleSubmit}>
				<FormCard
					title="Add Interests"
					className={cx(styles.addInterestsPage__formCard)}
				>
					<InterestTagSearch
						selectedTags={selectedTags}
						setSelectedTags={setSelectedTags}
					/>
					<button type="submit" className={styles.formCard_submitBtn}>
						Finish
					</button>
				</FormCard>
			</form>
		</div>
	);
}


export default AddInterestsPage;