import React, { useState } from 'react';
import { InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
	const [query, setQuery] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (onSearch) onSearch(query);
	};

	return (
		<Paper
			component="form"
			onSubmit={handleSubmit}
			elevation={3}
			className={styles.searchBar__form}
		>
			<InputBase
			 value={query}
			 onChange={(e) => setQuery(e.target.value)}
			 placeholder="Search…"
			 fullWidth
			 inputProps={{ 'aria-label': 'search' }}
			 className={styles.searchBar__input}
			/>
			<IconButton type="submit" aria-label="search">
				<SearchIcon />
			</IconButton>
		</Paper>
	);
};

export default SearchBar;
