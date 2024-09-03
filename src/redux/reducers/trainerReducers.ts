import {
  SET_FILTER_OPTIONS,
  SET_TRAINERS,
  SET_CATEGORIES_FILTERS,
  SET_SPECIALITY_FILTERS,
  SET_CERTIFICATE_FILTERS,
  SET_LANGUAGE_FILTERS,
  RESET_FILTERS,
  UPDATE_TRAINERS_LIST,
  SET_TRAINER_SPECIALITIES,
  SET_TRAINER_CERTIFICATES,
  NEW_SPECIALITY,
  NEW_CERTIFICATE,
  SET_ACTIVE_TRAINERS_LIST,
  SET_SPECIALITIES_IN_FILTER_OPTIONS,
  SET_SPECIALITIES_FILTER_OPTIONS,
  SET_TRAINER_LANGUAGES,
  SET_TRAINER_CATEGORIES,
} from "../types";

const INITIAL_STATE = {
  list: [],
  currentPage: 1,
  totalPages: 1,
  filterOptions: {},
  filters: {
    categories: [],
    specialities: [],
    certificates: [],
    languages: [],
  },
  activeTrainers: [],
  specialityFilterOptions: [],
  newSpeciality: [],
  trainerSpecialities: [],
  trainerCertificates: [],
  trainerLanguages: [],
  trainerCategories: [],
};

const trainerReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_TRAINERS:
      return {
        ...state,
        list: action.payload.list,
        currentPage: action.payload.page,
        totalPages: action.payload.lastPage,
      };
    case UPDATE_TRAINERS_LIST:
      return {
        ...state,
        list: [...state.list, ...action.payload.list],
        currentPage: action.payload.page,
        totalPages: action.payload.lastPage,
      };
    case SET_FILTER_OPTIONS:
      return {
        ...state,
        filterOptions: action.payload,
      };
    case SET_SPECIALITIES_IN_FILTER_OPTIONS:
      return {
        ...state,
        filterOptions: { ...state.filterOptions, specialities: action.payload },
      };
    case SET_SPECIALITIES_FILTER_OPTIONS:
      return {
        ...state,
        specialityFilterOptions: action.payload,
      };
    case SET_CATEGORIES_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, categories: action.payload },
      };
    case SET_SPECIALITY_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, specialities: action.payload },
      };
    case SET_CERTIFICATE_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, certificates: action.payload },
      };
    case SET_LANGUAGE_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, languages: action.payload },
      };
    case SET_ACTIVE_TRAINERS_LIST:
      return {
        ...state,
        activeTrainers: action.payload,
      };
    case SET_TRAINER_SPECIALITIES:
      return {
        ...state,
        trainerSpecialities: [...action.payload],
      };
    case SET_TRAINER_CERTIFICATES:
      return {
        ...state,
        trainerCertificates: [...action.payload],
      };
    case SET_TRAINER_LANGUAGES:
      return {
        ...state,
        trainerLanguages: [...action.payload],
      };
    case SET_TRAINER_CATEGORIES:
      return {
        ...state,
        trainerCategories: [...action.payload],
      };
    case RESET_FILTERS:
      return {
        ...state,
        filters: {
          categories: [],
          specialities: [],
          certificates: [],
          languages: [],
        },
      };

    case NEW_SPECIALITY:
      return {
        ...state,
        newSpeciality: [...action.payload],
      };

    case NEW_CERTIFICATE:
      return {
        ...state,
        newCertificate: [...action.payload],
      };

    default:
      return state;
  }
};

export { trainerReducer };
