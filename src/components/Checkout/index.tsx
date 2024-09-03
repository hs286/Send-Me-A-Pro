import React, { useState } from "react";
import "./style.css";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  AppDispatch,
  getPaymentIntentAction,
  getUpfrontClientSecretAction,
  PackageFactorModal,
  postUpdateUpfrontUserPackageAction,
  subscriptionCheckoutAction,
  subscriptionPurchaseAction,
  UserModal,
} from "../../redux";
import Proptypes from "prop-types";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

interface CheckoutProps {
  handleCompleteCheckout: (result: any) => void;
  setDoRegistration: (flag: boolean) => void;
  setIsLoadingData: (flag: boolean) => void;
  onHide: () => void;
}

const Checkout = (props: CheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch<AppDispatch>();
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
  const profile: UserModal = useSelector((state: any) => state.user.profile);
  const factor: PackageFactorModal = useSelector(
    (state: any) => state.package.factor
  );
  const { selectedFranchise } = useSelector((state: any) => state.user);

  const createPaymentMethodOnStripe = async () => {
    if (stripe && elements) {
      let cardNumberElement = elements.getElement(CardNumberElement);
      if (cardNumberElement) {
        let paymentMethodResponse = await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            name: profile?.firstname + " " + profile?.lastname,
          },
        });
        if (paymentMethodResponse.error) {
          toast.error(paymentMethodResponse.error.message);
          console.error(paymentMethodResponse.error);
          throw paymentMethodResponse.error;
        }
        return paymentMethodResponse.paymentMethod;
      }
    }
  };

  const purchaseUpfront = async () => {
    if (stripe && elements) {
      props?.setIsLoadingData(true);
      let paymentMethod = await createPaymentMethodOnStripe();
      let response = await getUpfrontClientSecretAction(factor, profile);
      let client_secret: string = response?.clientSecret?.client_secret;
      let userPackage = response?.upfrontUserPackage;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: paymentMethod?.id,
      });
      if (result.error) {
        toast.error(result.error.message);
        console.error(result.error);
        props?.setIsLoadingData(false);
      } else {
        let paymentIntent: any = await getPaymentIntentAction(
          result?.paymentIntent?.id,
          userPackage?.customer_id,
          factor?.data?.franchise_id
        );
        let obj = {
          user_package_id: userPackage?.id,
          charge_id: paymentIntent?.charges?.data[0]?.id,
          package_id: userPackage?.package_id,
          customer_id: userPackage?.customer_id,
          totalPriceWithDiscount: factor?.totalPriceWithDiscount,
          coupon_id: factor.coupon_id,
          tax_id: factor.appliedTaxId,
          tax_percentage: factor.appliedTaxPercentage,
        };
        dispatch(postUpdateUpfrontUserPackageAction(obj));
        toast("Payment successfull");
        props?.setIsLoadingData(false);
        if (selectedFranchise?.domain) {
          window.open(
            `https://${selectedFranchise?.domain}.sendmeapro.com/thank-you`,
            "_self"
          );
        } else {
          props.onHide();
        }
      }
    }
  };

  const purchaseMonthly = async () => {
    if (stripe && elements) {
      props?.setIsLoadingData(true);
      let paymentMethod = await createPaymentMethodOnStripe();
      let { userPackage, stripePlanResponse } =
        await subscriptionPurchaseAction(factor, profile);
      let subscription = await subscriptionCheckoutAction(
        factor,
        profile,
        paymentMethod,
        userPackage,
        stripePlanResponse
      );
      let paymentIntent = subscription?.latest_invoice?.payment_intent;
      if (paymentIntent?.status === "requires_action") {
        let result = await stripe.confirmCardPayment(
          paymentIntent.client_secret,
          {
            payment_method: paymentMethod?.id,
            receipt_email: profile?.email,
          }
        );
        if (result.error) {
          toast.error(result.error.message);
          console.error(result.error);
          props?.setIsLoadingData(false);
          throw result.error;
        } else {
          toast("Payment successfull");
          props?.handleCompleteCheckout(result);
          props?.setIsLoadingData(false);
          if (selectedFranchise?.domain) {
            window.open(
              `https://${selectedFranchise?.domain}.sendmeapro.com/thank-you`,
              "_self"
            );
          } else {
            props.onHide();
          }
        }
      } else {
        toast("Payment successfull");
        props?.handleCompleteCheckout(null);
        props?.setIsLoadingData(false);
        if (selectedFranchise?.domain) {
          window.open(
            `https://${selectedFranchise?.domain}.sendmeapro.com/thank-you`,
            "_self"
          );
        } else {
          props.onHide();
        }
      }
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (selectedFranchise?.id !== profile?.Franchise[0]?._Franchise?.id) {
      toast.error(
        "You are already registered under a particular location and if you want to purchase a package from another location then you have to create a new account with different emails"
      );
      return;
    }
    if (!profile?.id) {
      props.setDoRegistration(true);
      return;
    }
    if (!hasAgreedToTerms) {
      toast.error("Please agree to T&C and Privacy Policy");
      return;
    }
    if (factor?.upfront) {
      purchaseUpfront();
    } else {
      purchaseMonthly();
    }
  };

  const handleNavigateToFaq = (type: string) => {
    let url = type;
    if (selectedFranchise?.name) {
      url = `${selectedFranchise?.domain}/${type}`;
    }
    window.open(`${window.location.origin}/${url}`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mt-3 border-top pt-3">
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Card number</Form.Label>
            <CardNumberElement
              options={{
                showIcon: true,
                classes: {
                  base: "form-control",
                },
                style: {
                  base: {
                    fontSize: "18px",
                    "::placeholder": {
                      color: "#929292",
                      fontWeight: "lighter",
                    },
                  },
                },
              }}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Form.Group className="mb-3 w-48" controlId="formBasicEmail">
              <Form.Label>Expiration date</Form.Label>
              <CardExpiryElement
                options={{
                  classes: {
                    base: "form-control",
                  },
                  style: {
                    base: {
                      fontSize: "18px",
                      "::placeholder": {
                        color: "#929292",
                        fontWeight: "lighter",
                      },
                    },
                  },
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-48" controlId="formBasicEmail">
              <Form.Label>CVC</Form.Label>
              <CardCvcElement
                options={{
                  classes: {
                    base: "form-control",
                  },
                  style: {
                    base: {
                      fontSize: "18px",
                      "::placeholder": {
                        color: "#929292",
                        fontWeight: "lighter",
                      },
                    },
                  },
                }}
              />
            </Form.Group>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={8} sm={9} xl={10} className="pe-0">
          <Form.Check type={"checkbox"} inline>
            <Form.Check.Input
              onClick={() => setHasAgreedToTerms(!hasAgreedToTerms)}
              checked={hasAgreedToTerms}
              onChange={() => {}}
              type={"checkbox"}
            />
            <Form.Check.Label>
              <span className="term-and-condition-text color-secondary">
                By Clicking here, I agree to the{" "}
                <span
                  role="button"
                  className="color-primary"
                  onClick={() => handleNavigateToFaq("TAC")}
                >
                  Terms and Conditions
                </span>{" "}
                and{" "}
                <span
                  role="button"
                  className="color-primary"
                  onClick={() => handleNavigateToFaq("PP")}
                >
                  Privacy policy
                </span>
              </span>
            </Form.Check.Label>
          </Form.Check>
        </Col>
        <Col
          className="d-flex justify-content-end align-items-start"
          xs={4}
          sm={3}
          xl={2}
        >
          <Button
            onClick={() => handleNavigateToFaq("FAQ")}
            className="background-primary border-color-primary btn-sm color-white ps-3 pe-3"
          >
            FAQ
          </Button>
        </Col>
      </Row>
      <Row className="mt-1">
        <Button
          className="background-primary border-color-primary mt-3 w-100"
          type="submit"
        >
          Checkout
        </Button>
      </Row>
    </Form>
  );
};

Checkout.propTypes = {
  handleCompleteCheckout: Proptypes.func,
  setDoRegistration: Proptypes.func,
  setIsLoadingData: Proptypes.func,
};

export { Checkout };
