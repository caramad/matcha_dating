
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