import React from "react";
import SearchBar from "./SearchBar";
import styles from "./InterestTagSearch.module.css";

const InterestTagSearch = ({ children, className = "", ...props }) => {
	return (
		<div className={`${className}`} {...props}>
			<SearchBar></SearchBar>
			{children}
		</div>
	);
};

export default InterestTagSearch;
