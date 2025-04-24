import React, { useState } from 'react';
import { InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './SearchBar.module.css';

const SearchBar = ({ value, onChange }) => {
	return (
		<Paper
			component="form"
			onSubmit={(e) => e.preventDefault()}
			elevation={3}
			className={styles.searchBar__form}
		>
			<InputBase
				value={value}
				onChange={onChange}
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
