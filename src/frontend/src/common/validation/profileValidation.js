
export const NAME_MIN_LEN = 2;
export const NAME_MAX_LEN = 50;

export const getNameValidationRules = (fieldName = "Name") => ({
	required: `${fieldName} is required`,
	minLength: {
		value: NAME_MIN_LEN,
		message: `${fieldName} must be at least ${NAME_MIN_LEN} characters`,
	},
	maxLength: {
		value: NAME_MAX_LEN,
		message: `${fieldName} must be at most ${NAME_MAX_LEN} characters`,
	},
	pattern: {
		value: new RegExp(`^[A-Za-zÀ-ÖØ-öø-ÿ' -]{1,${NAME_MAX_LEN}}$`),
		message: `Enter a valid ${fieldName.toLowerCase()}`,
	},
});

export const getDayValidationRules = () => ({
	required: "Day is required",
	pattern: {
		value: /^(0?[1-9]|[12][0-9]|3[01])$/,
		message: `Day must be between 1 and 31`,
	},
});

export const getMonthValidationRules = () => ({
	required: `Month is required`,
	pattern: {
		value: /^(0?[1-9]|1[0-2])$/,
		message: `Month must be between 1 and 12`,
	},
});

export const getYearValidationRules = (min = 1900, max = new Date().getFullYear()) => ({
	required: `Year is required`,
	pattern: {
		value: /^\d{4}$/,
		message: `Year must be a 4-digit number`,
	},
	validate: {
		range: (value) => {
			const num = parseInt(value, 10);
			return (
				num >= min && num <= max || `Year must be between ${min} and ${max}`
			);
		},
	},
});


export const validateFullDate = (day, month, year) => {
	const d = parseInt(day, 10);
	const m = parseInt(month, 10);
	const y = parseInt(year, 10);

	if (isNaN(d) || isNaN(m) || isNaN(y)) return `Date of birth must be complete`;

	const date = new Date(y, m - 1, d);

	const isValid =
		date.getFullYear() === y &&
		date.getMonth() + 1 === m &&
		date.getDate() === d;

	return isValid ? null : `Date of birth is not a valid date`;
};
