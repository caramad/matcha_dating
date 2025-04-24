import { useNavigate } from 'react-router-dom';
import commonStyles from '@/common/styles/Common.module.css';
import FormCard from '@/common/components/FormCard';
import InterestTagSearch from '@/common/components/InterestTagSearch';
import addInterestsPageStyles from './AddInterestsPage.module.css';
import formCardStyles from '@/common/components/FormCard.module.css';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import cx from '@/utils/utils';

const styles = { ...formCardStyles, ...addInterestsPageStyles};

function AddInterestsPage() {
	const navigate = useNavigate();

	return (
		<div className={commonStyles.common__mainBackground}>
			<FormCard title="Add Interests" className={cx(styles.addInterestsPage__formCard)}>
				<InterestTagSearch></InterestTagSearch>
				<button type="submit" className={styles.formCard_submitBtn}>Finish</button>
			</FormCard>
		</div>
	)
}

export default AddInterestsPage;