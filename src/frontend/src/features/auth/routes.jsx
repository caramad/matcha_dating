import { Route } from "react-router-dom";
import AuthPage from "./AuthPage";

const AuthRoutes = [
	<Route key="auth" path="/auth" element={<AuthPage />} />,
];

export default AuthRoutes;