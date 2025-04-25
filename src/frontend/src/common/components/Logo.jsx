import logoStyles from './Logo.module.css';
import { Link } from 'react-router-dom';
import patoLogoNoBorder from '@/assets/pato-logo-no-border.png'
import patoLogoWithBorder from '@/assets/pato-logo-border.png'

function Logo() {
	return (
		<Link to="/" className={logoStyles.logoContainer}>
			<img src={patoLogoWithBorder} alt="header pato logo" className={logoStyles.logo} />
			<span className={logoStyles.brandLabel}>Pato</span>
		</Link>
	);
}

export default Logo;