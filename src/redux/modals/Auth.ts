interface CountryModal {
  capital: string;
  created_at: string;
  curency_symbol: string;
  currency: string;
  id: number;
  iso: string;
  name: string;
  phone: string;
  updated_at: string;
}

interface UpdateBankDetailModal {
  dob: string;
  phone: string;
  country_id: number;
  franchise: any;
  bankDataChanged: boolean;
  bankData: any;
  status: boolean;
}
interface StateModal {
  country_id: number;
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
}
interface CityModal {
  created_at: string;
  id: number;
  name: string;
  state_id: number;
  updated_at: string;
}
interface SignupModal {
  role: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  zipcode?: string;
  dob?: string;
  gender?: string;
  phone: string;
  user_country: string;
  country_id: number;
  state_id?: number;
  city_id?: number;
  franchise: [{ franchise_id: number; active: boolean }];
  fromAdmin: boolean;
}
interface SigninModal {
  state: RoleSignIn;
  email: string;
  password: string;
}
interface GuestUpModal {
  role: string;
}
interface OAuthModal {
  accessToken: string;
  token: string;
}

interface UpdateProfileModal {
  firstname: string;
  lastname: string;
  zipcode: string;
  dob: string;
  gender: string;
  phone: string;
  country_id: number;
  state_id: number;
  city_id: number;
  status: boolean;
  franchise: any;
}
interface UpdatePasswordModal {
  oldPassword: string;
  newPassword: string;
}

interface ForgotPasswordState {
  email: string;
}

interface ResetPasswordState {
  email: string;
  code: string;
  password: string;
}

export enum RoleSignIn {
  PANEL = "PANEL",
  TR_APP = "TR_APP",
  CU_APP = "CU_APP",
}

interface ProviderSignupModal {
  role: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  zipcode?: string;
  dob?: string;
  gender?: string;
  phone: string;
  country_id: number;
  user_country: string;
  state_id?: number;
  city_id?: number;
  franchise: [{ franchise_id: number; active: boolean }];
  fromAdmin: boolean;
  individual_address_city: string;
  individual_address_country: string;
  individual_address_line1: string;
  individual_address_state: string;
  individual_phone: string;
  individual_ssn_last_4: string;
}

export type {
  CountryModal,
  SignupModal,
  SigninModal,
  OAuthModal,
  GuestUpModal,
  StateModal,
  CityModal,
  UpdateProfileModal,
  UpdatePasswordModal,
  ForgotPasswordState,
  ResetPasswordState,
  UpdateBankDetailModal,
  ProviderSignupModal,
};
