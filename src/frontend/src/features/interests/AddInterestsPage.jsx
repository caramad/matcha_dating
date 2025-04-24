import { useNavigate } from 'react-router-dom';
import commonStyles from '@/common/styles/Common.module.css';
import FormCard from '@/common/components/FormCard';
import InterestTagSearch from '@/common/components/InterestTagSearch';
import interestTagSearchStyles from '@/common/components/InterestTagSearch.module.css';
import formCardStyles from '@/common/components/FormCard.module.css';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import cx from '@/utils/utils';

const styles = { ...formCardStyles, ...interestTagSearchStyles};

function AddInterestsPage() {
	const navigate = useNavigate();

	return (
		<div className={commonStyles.common__mainBackground}>
			<FormCard title="Add Interests" className={styles.formCard}>
				<InterestTagSearch></InterestTagSearch>
			</FormCard>
		</div>
	)
}

export default AddInterestsPage;