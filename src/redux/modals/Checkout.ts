import { CountryModal } from "./Auth";

interface CreateClientSecretMetadataModal {
  package_id: number;
  user_package: number;
  customer_id: number;
  franchise_id: number;
  coupon_id?: number;
  tax_id?: number;
  tax_percentage?: any;
  platform?: string;
  provider?: string;
}

interface UpdateUpfrontUserPackageModal {
  user_package_id: number;
  charge_id: string;
  coupon_id?: number;
  package_id: number;
  customer_id: number;
  totalPriceWithDiscount: number;
  tax_id?: number;
  tax_percentage?: string;
}

interface CreateStripePlanModal {
  description: string;
  stripeMonthly: number;
  franchiseID: number;
  payment_periodicity: string;
  price_currency_code: string;
  customerId: number;
  country: CountryModal;
}

interface BuyPackageModal {
  upfront: boolean;
  planId: string;
  coupon_id?: number;
  countSession?: number;
}

interface CreateSubscriptionModal {
  customerId: string;
  priceId: string;
  month: any;
  paymentMethodId: string;
  metadata: {
    plan_id: string;
    customer_id: number;
    franchise_id: number;
    package_id: number;
    user_package: number;
    platform: string;
    provider: string;
  };
  coupon_id?: number;
  franchise_id: number;
}

interface CouponModal {
  code: string;
  country_id: number;
  expireTime: string;
  franchise_id: number;
  id: number;
  maxBounce: null;
  multiple: true;
  percent: true;
  promocode: string;
  status: string;
  stripe_coupon_id: string;
  stripe_data: string;
  value: number;
}

export type {
  CreateClientSecretMetadataModal,
  UpdateUpfrontUserPackageModal,
  CreateStripePlanModal,
  BuyPackageModal,
  CreateSubscriptionModal,
  CouponModal,
};
