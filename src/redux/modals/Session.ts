export enum StateSession {
  CLIENT_APPROVE = "CLIENT_APPROVE",
  CLIENT_NOT_APPROVE = "CLIENT_NOT_APPROVE",
  ADMIN_APPROVE = "ADMIN_APPROVE",
  ADMIN_NOT_APPROVE = "ADMIN_NOT_APPROVE",
  AUTO_APPROVE = "AUTO_APPROVE",
  NEW = "NEW",
}

export enum UpdateStateSession {
  CLIENT_APPROVE = "CA",
  CLIENT_REJECT = "CR",
}

interface sessionParams {
  request_opportunity_id: number;
  location: string;
  session_date: string;
  late_cancel: boolean;
  message: string;
  address?: string;
  status: string;
  user_package_id?: number;
  requestOpportunity?: any;
  category_id?: number;
  package_type_id?: number;
}

interface ReviewsStateModel {
  user_id: number;
  trainer_id: number;
  userInfo?: any;
  trainerInfo?: any;
  rating: number;
  note: string;
  user_name: string;
}

export type { ReviewsStateModel, sessionParams };
