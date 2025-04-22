import { useNavigate } from 'react-router-dom';
import styles from '@/common/styles/Common.module.css';
import FormCard from '@/common/components/FormCard';
import { Link } from 'react-router-dom';
import React from 'react';

function CreateProfilePage() {
	const navigate = useNavigate();

	return (
		<div className={styles.common__mainBackground}>
			<div className="create-profile-page-container">
				<FormCard title="Create Profile">
				</FormCard>
			</div>

		</div>
	);
}

export default CreateProfilePage;