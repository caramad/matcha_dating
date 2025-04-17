import HomePage from "./HomePage";
import React from "react";
import { Route } from "react-router-dom";

const HomeRoutes = [
	<Route key="home" path="/" element={<HomePage />} />,
];

export default HomeRoutes;