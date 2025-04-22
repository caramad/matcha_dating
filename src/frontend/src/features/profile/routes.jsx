import { Route } from "react-router-dom";
import CreateProfilePage from "./CreateProfilePage";

const ProfileRoutes = [
	<Route key="create-profile" path="/create-profile" element={<CreateProfilePage />} />,
];

export default ProfileRoutes;