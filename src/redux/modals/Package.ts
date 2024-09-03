import { CountryModal } from "./Auth";
import { ServiceModal } from "./Service";

interface PackageTypeModal {
  id: number;
  name: string;
}
interface PackageModal {
  discount_pay: number;
  id: number;
  isDynamicQuantity: boolean;
  month: number;
  package_category: number;
  package_name: string;
  package_session_type: string;
  package_type: string;
  package_type_id: number;
  payment_periodicity: string;
  plan_id: string;
  price_amount: number;
  quantity: number;
  quantity_times: string;
  session_time: number;
  status: boolean;
  price_currency_code: string;
  promo?: string;
  PackageType?: PackageTypeModal;
  categories?: Array<ServiceModal>;
}

interface PackageCategoryModal {
  Packages: Array<PackageModal>;
  franchise_id: number;
  icon: string;
  id: number;
  name: string;
  status: boolean;
}

interface PackageFactorModal {
  data: {
    id: number;
    franchise_id: number;
    package_category: number;
    month: number;
    quantity: number;
    quantity_free: number;
    discount_pay: number;
    payment_periodicity: string;
    package_type: string;
    max_additional_person: number;
    promo: any;
    session_time: number;
    description: string;
    price_amount: number;
    price_currency_code: string;
    additional_person_amount: number;
    additional_person_currency_code: string;
    status: boolean;
    mode: string;
    deleted_at: string;
    created_at: string;
    updated_at: string;
    plan_id: string;
    package_name: string;
    package_type_id: number;
    arabic_package_name: string;
    arabic_description: string;
    package_session_type: string;
    isDynamicQuantity: boolean;
    quantity_times: string;
  };
  upfront: boolean;
  coupon: string;
  discount: number;
  customerId: number;
  paidMonths: number;
  allSession: number;
  totalPrice: number;
  priceOnetime: number;
  priceMonthly: number;
  stripeMonthly: number;
  stripeOnetime: number;
  allPaidSession: number;
  lastMonthResidue: number;
  totalMonthlyPrice: number;
  totalPriceWithCoupon: number;
  allPaidSessionAmount: number;
  additionalPersonAmount: number;
  totalPriceCouponAmount: number;
  totalPriceWithDiscount: number;
  totalMonthlyPriceCouponAmount: number;
  publishableKey: string;
  originalMonthlyPrice?: any;
  coupon_id?: any;
  originalPriceAmount?: any;
  originalTotalPriceWithDiscount?: any;
  appliedTaxId?: number;
  appliedTaxPercentage?: any;
  country: CountryModal;
}

interface UserPackageModal {
  id: number;
  additional_person_amount: number;
  auto_renew: boolean;
  charge_id: string;
  coupon_id: number;
  created_at: string;
  customer_id: number;
  description: string;
  expire_time: string;
  last_month_residue: number;
  max_additional_person: number;
  month: number;
  package: PackageModal;
  package_id: number;
  paid_months: number;
  payment_amount: number;
  payment_amount_currency_code: string;
  payment_mode: string;
  plan_id: string;
  price_amount: number;
  quantity: number;
  quantity_free: number;
  quantity_times: string;
  session_time: number;
  session_user: number;
  status: string;
  subscription_id: string;
  tax_id: number;
  tax_percentage: number;
  updated_at: string;
  upfront: boolean;
}

interface PackageStatsModal {
  expireTime: string;
  paidSessions: number;
  completedSessions: number;
  remainingPaidSessions: number;
  sessionsPerMonth: number;
  totalMonths: number;
  totalCommitedSessions: number;
  pricePerSession: number;
  paymentType: string;
  payableAmount: number;
  status: string;
  status_message?: string;
  package?: PackageModal;
  userPackage?: UserPackageModal;
}

export type {
  PackageModal,
  PackageCategoryModal,
  PackageFactorModal,
  PackageTypeModal,
  PackageStatsModal,
  UserPackageModal,
};
