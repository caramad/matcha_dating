import React, { useState } from "react";
import SearchBar from "./SearchBar";
import styles from "./InterestTagSearch.module.css";

const allTags = [
	"harrypotter", "documentaries", "90skid", "gymnastics",
	"meditation", "foodie", "basketball", "hockey",
	"sushi", "vegan", "running",
];

const InterestTagSearch = ({ className = "", ...props }) => {
	const [selectedTags, setSelectedTags] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const toggleTag = (tag) => {
		setSelectedTags((prev) =>
			prev.includes(tag)
				? prev.filter((t) => t !== tag)
				: [...prev, tag]
		);
	};

	const filteredTags = allTags.filter((tag) =>
		tag.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className={`${styles.interestTagSearch__container} ${className}`} {...props}>
			<SearchBar
				onChange={(e) => setSearchTerm(e.target.value)}
				value={searchTerm}
			/>
			<div className={styles.interestTagSearch__tags}>
				{filteredTags.map((tag) => (
					<div
						key={tag}
						className={`${styles.interestTagSearch__tag} ${selectedTags.includes(tag) ? styles.interestTagSearch__selected : ""
							}`}
						onClick={() => toggleTag(tag)}
					>
						#{tag}
					</div>
				))}
			</div>
		</div>
	);
};

export default InterestTagSearch;
