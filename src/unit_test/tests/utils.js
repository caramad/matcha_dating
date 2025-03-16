const normalizeSQL = (query) => 
    query.replace(/\s+/g, " ")  // Replace multiple spaces, newlines, and tabs with a single space
         .replace(/\n/g, " ")   // Explicitly remove newlines
         .replace(/\(\s+/g, "(") // Remove space after opening parenthesis
         .replace(/\s+\)/g, ")") // Remove space before closing parenthesis
         .trim();                // Remove leading and trailing spaces


// compare queries
const verifyQuery = (db, query) => {
	const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
	const expectedQuery = normalizeSQL(query);
	expect(actualQuery).toBe(expectedQuery);
}

module.exports = {verifyQuery, normalizeSQL};