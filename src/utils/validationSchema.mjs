export const validationSchema = {
  username: {
    isLength: {
      options: {
        min: 3,
        max: 30,
      },
      errorMessage: "Must be atleast 3 to 30 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: true,
  },
};
