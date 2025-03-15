const normalizeSQL = (query) => 
    query.replace(/\s+/g, " ")  // Replace multiple spaces, newlines, and tabs with a single space
         .replace(/\n/g, " ")   // Explicitly remove newlines
         .replace(/\(\s+/g, "(") // Remove space after opening parenthesis
         .replace(/\s+\)/g, ")") // Remove space before closing parenthesis
         .trim();                // Remove leading and trailing spaces


module.exports = normalizeSQL;