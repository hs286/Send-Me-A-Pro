import { CertificateModal } from "./Certificate";
import { CategoryModal } from "./Category";
import { LanguageModal } from "./Language";
import { SpecialityModal } from "./Speciality";
import { FranchiseModal } from "./Franchise";

interface TrainerCategoryModal {
  id: number;
  trainer_id: number;
  category_id: number;
  Category: {
    id: number;
    name: string;
    image_url: string;
    arabic_name: string;
  };
}
interface TrainerSpecialityModal {
  id: number;
  trainer_id: number;
  speciality_id: number;
  Speciality: {
    id: number;
    name: string;
  };
}
interface TrainerCertificationModal {
  id: number;
  trainer_id: number;
  certification_id: number;
  Certification: {
    id: number;
    name: string;
  };
}
interface TrainerLanguageModal {
  id: number;
  trainer_id: number;
  language_id: number;
  Language: {
    id: number;
    name: string;
  };
}

interface TrainerDetailsModal {
  id: number;
  user_id: number;
  title: string;
  start_year: string;
  bio: string;
  profession?: string;
  Categories: Array<TrainerCategoryModal>;
  Specialities: Array<TrainerSpecialityModal>;
  Certifications: Array<TrainerCertificationModal>;
  Languages: Array<TrainerLanguageModal>;
}

interface ReviewsGetModel {
  created_at: string;
  id: number;
  note: string;
  publish: false;
  rating: number;
  trainer_id: number;
  updated_at: string;
  user_id: number;
  user_name: string;
}

interface TrainerModal {
  id: number;
  firstname: string;
  lastname: string;
  avatar: string;
  gender: string;
  description: string;
  TrainerDetails: TrainerDetailsModal;
  TrainerReviews?: Array<ReviewsGetModel>;
  franchise: FranchiseModal;
  City: {
    name: string;
  };
  State: {
    name: string;
  };
  totalRating: number;
}

interface FilterOptionsModal {
  certificates: Array<CertificateModal>;
  categories: Array<CategoryModal>;
  languages: Array<LanguageModal>;
  specialities: Array<SpecialityModal>;
}

interface GetTrainerFilterModal {
  franchise_id?: number;
  filtersData?: FilterData;
  page: number;
}

interface FilterData {
  categories: Array<number>;
  specialities: Array<number>;
  certificates: Array<number>;
  languages: Array<number>;
}

export type {
  GetTrainerFilterModal,
  TrainerModal,
  FilterOptionsModal,
  FilterData,
};
