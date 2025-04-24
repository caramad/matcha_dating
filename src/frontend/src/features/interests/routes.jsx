import { Route } from "react-router-dom";
import AddInterestsPage from "./AddInterestsPage";

const InterestsRoutes = [
	<Route key="interests" path="/interests/create" element={<AddInterestsPage />} />,
];

export default InterestsRoutes;