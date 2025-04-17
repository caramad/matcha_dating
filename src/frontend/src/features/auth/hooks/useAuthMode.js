import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuthMode(initialMode = "login") {
	const [mode, setMode] = useState(initialMode);
	const navigate = useNavigate();

	const toggleMode = () => {
		const newMode = mode === "login" ? "signup" : "login";
		setMode(newMode);
		navigate(`?mode=${newMode}`, { replace: true });
	};

	return { mode, toggleMode };
}