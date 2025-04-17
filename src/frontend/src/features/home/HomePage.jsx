import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import patoLogoNoBorder from '@/assets/pato-logo-no-border.png'
import patoLogoWithBorder from '@/assets/pato-logo-border.png'
import { Link } from 'react-router-dom';


function HomePage() {
	const navigate = useNavigate();

	return (
		<div className={styles.home}>
			<header className={styles.home__header}>
				<Link to="/" className={styles.home__brand}>
					<img src={patoLogoWithBorder} alt="header pato logo" className={styles.home__logo} />
					<span className={styles.home__brandLabel}>Pato</span>
				</Link>
			</header>

			<main className={styles.home__body}>
				<div className={styles.home__intro}>
					<h1 className={styles.home__title}>
						HIGH STAKES,<br />BIG SPARKS
					</h1>
					<p className={styles.home__subtitle}>Take a gamble on love!</p>
					<div className={styles.home__actions}>
						<button
							className={styles.home__button}
							onClick={() => navigate('/auth?mode=login')}
						>
							Login
						</button>
						<button
							className={styles.home__button}
							onClick={() => navigate('/auth?mode=signup')}
						>
							Sign Up
						</button>
					</div>
				</div>

				<div className={styles.home__illustration}>
					{<img src={patoLogoNoBorder} alt="pato logo" className={styles.home__duck} />}
				</div>
			</main>
		</div>
	);
}

export default HomePage;