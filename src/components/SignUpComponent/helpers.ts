interface SignupErrorModal {
  firstNameError: string;
  lastNameError: string;
  emailError: string;
  phoneError: string;
  passwordError: string;
  confirmPasswordError: string;
  countryError: string;
  franchiseError: string;
}

interface SignInErrorModal {
  emailError: string;
  passwordError: string;
  countryError?: string;
  franchiseError?: string;
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const mobileRegex = /^\+[1-9]{1}[0-9]{3,14}$/;

export type { SignupErrorModal, SignInErrorModal };
export { emailRegex, mobileRegex };
