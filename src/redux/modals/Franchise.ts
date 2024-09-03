import { CountryModal } from "./Auth";

interface FranchiseKeys {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  franchise_id: number;
  publishable_key: string;
  secret_key: string;
}

interface FranchiseModal {
  id: number;
  name: string;
  geometry: Array<Array<number>>;
  city_id: number;
  admin: number;
  created_at: string;
  updated_at: string;
  country_id: number;
  state_id: number;
  review_switch: true;
  associate_emails: string;
  FranchiseKeys: FranchiseKeys | null;
  country: CountryModal;
  domain: string;
  facebook: string;
  instagram: string;
}

export type { FranchiseModal };
