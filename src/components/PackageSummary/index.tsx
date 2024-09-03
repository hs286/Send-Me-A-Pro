import React, { useCallback, useEffect, useState } from "react";
import "./style.css";
import {
  AppDispatch,
  applyCouponAction,
  CouponModal,
  FranchiseModal,
  getPaymentLinkAction,
  makeCouponEmptyAction,
  PackageFactorModal,
  PackageModal,
  postPackageFactorAction,
  updatePackageFactorAction,
  UserModal,
} from "../../redux";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Checkout } from "../Checkout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
interface PackageSummaryProps {
  package: PackageModal | undefined;
  handleCheckoutComplete: (result: any) => void;
  setDoRegistration: (flag: boolean) => void;
  onHide: () => void;
}

const DAYS_MONTH = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30,
];
const DAYS_WEEK = [1, 2, 3, 4, 5, 6, 7];

const PackageSummary = (props: PackageSummaryProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMode, setSelectedMode] = useState<string>(
    props?.package?.package_session_type === "session" ? "upfront" : "monthly"
  );
  const [coupon, setCoupon] = useState<string>("");
  const [selectedQuanity, setSelectedQuanity] = useState<number>(
    props?.package?.quantity || 2
  );
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);

  const factor: PackageFactorModal = useSelector(
    (state: any) => state.package.factor
  );
  const appliedCoupon: CouponModal = useSelector(
    (state: any) => state.package.coupon
  );

  const user: UserModal = useSelector((state: any) => state.user.profile);
  const selectedFranchise: FranchiseModal = useSelector(
    (state: any) => state.user.selectedFranchise
  );

  const getPackageFactor = useCallback(() => {
    if (props?.package?.id) {
      setIsLoadingData(true);
      dispatch(makeCouponEmptyAction());
      let body: any = {
        upfront: selectedMode === "upfront",
        promo: props?.package?.promo,
      };
      if (props?.package?.isDynamicQuantity) {
        body.countSession = selectedQuanity;
      }
      if (user?.id) {
        body.customerID = user?.id;
      }
      dispatch(
        postPackageFactorAction(
          props?.package?.id,
          body,
          () => {
            setIsLoadingData(false);
          },
          () => {
            setIsLoadingData(false);
          }
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, props?.package, selectedMode, selectedQuanity]);

  useEffect(() => {
    getPackageFactor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, props?.package, selectedMode, selectedQuanity]);

  const numberWithCommas = (x: any) => {
    if (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return 0;
  };

  const getQuantityDropdownOptions = () => {
    if (props?.package?.isDynamicQuantity) {
      if (props?.package?.quantity_times === "week") {
        return DAYS_WEEK.map((x) => (
          <option key={"day-" + x} value={x}>
            {x}
          </option>
        ));
      } else {
        return DAYS_MONTH.map((x) => (
          <option key={"day-" + x} value={x}>
            {x}
          </option>
        ));
      }
    } else {
      return (
        <option value={props?.package?.quantity}>
          {props?.package?.quantity}
        </option>
      );
    }
  };

  const applyCoupon = () => {
    if (appliedCoupon?.code) {
      getPackageFactor();
      return;
    }
    setIsLoadingData(true);
    dispatch(
      applyCouponAction(
        coupon,
        selectedFranchise?.id,
        (result: CouponModal) => {
          let discountedAmount = 0;
          let discountedPriceAmount = 0;
          let originalAmount = parseFloat(
            "" +
              factor[
                factor?.upfront ? "totalPriceWithDiscount" : "totalMonthlyPrice"
              ]
          );
          // let originalPriceAmount = parseInt(""+factor['data']['price_amount']);

          if (result.percent === true) {
            let percentAmount = originalAmount * (result.value / 100);
            // let percentPriceAmount = originalPriceAmount * (result.value/100);
            if (result.maxBounce && result.maxBounce !== "") {
              percentAmount =
                percentAmount <= result.maxBounce
                  ? percentAmount
                  : result.maxBounce;
            }
            discountedAmount = originalAmount - percentAmount;
            //discountedPriceAmount = originalPriceAmount-percentPriceAmount;
          } else {
            discountedAmount = originalAmount - result.value;
            //discountedPriceAmount = originalPriceAmount-result.value;
          }
          if (discountedAmount < 0) {
            discountedAmount = 0;
          }
          let sessions = factor?.data?.quantity || 0;
          let months = factor?.data?.month || 0;
          if (factor?.upfront) {
            discountedPriceAmount =
              factor?.data?.package_session_type === "session"
                ? discountedAmount / sessions
                : discountedAmount / (sessions * 4 * months);
          } else {
            // TODO CAUTION: For Monthly the session functionality needs to revised.
            discountedPriceAmount =
              factor?.data?.package_session_type === "session"
                ? discountedAmount / sessions
                : discountedAmount / (sessions * 4);
          }
          if (discountedPriceAmount < 0) {
            discountedPriceAmount = 0;
          }
          let factorTemp = {
            ...factor,
            originalMonthlyPrice: originalAmount,
            [factor?.upfront ? "totalPriceWithDiscount" : "totalMonthlyPrice"]:
              discountedAmount,
            data: {
              ...factor.data,
              price_amount: discountedPriceAmount,
            },
            originalPriceAmount: factor.data.price_amount,
            coupon_id: result.id,
            originalTotalPriceWithDiscount: factor.totalPriceWithDiscount,
          };
          dispatch(updatePackageFactorAction(factorTemp));
          setIsLoadingData(false);
        },
        (error: any) => {
          getPackageFactor();
          setIsLoadingData(false);
        }
      )
    );
  };

  const handleCheckout = () => {
    if (!hasAgreedToTerms) {
      toast.error("Please agree to T&C and Privacy Policy");
      return;
    }
    setIsLoadingData(true);
    dispatch(
      getPaymentLinkAction(
        factor,
        (response: any) => {
          setIsLoadingData(false);
          window.open(response?.url);
        },
        (error: any) => {
          setIsLoadingData(false);
        }
      )
    );
  };

  const renderSessionsPerMonth = () => {
    const quantity_times = factor?.data?.quantity_times === "week" ? 4 : 1;
    return (
      <Row>
        <Col>
          <span>Sessions per month:</span>
        </Col>
        <Col className="text-end" xs={2}>
          <span>{factor?.data?.quantity * quantity_times}</span>
        </Col>
      </Row>
    );
  };

  const renderTotalMonths = () => {
    return (
      <Row>
        <Col>
          <span>Number of months valid for:</span>
        </Col>
        <Col className="text-end" xs={2}>
          <span>{factor?.data?.month}</span>
        </Col>
      </Row>
    );
  };

  const renderTotalCommitedSessions = () => {
    return (
      <Row>
        <Col>
          <span>Total commited sessions:</span>
        </Col>
        <Col className="text-end" xs={2}>
          <span>{factor?.allSession}</span>
        </Col>
      </Row>
    );
  };

  const renderPricePerSession = () => {
    return (
      <Row>
        <Col xs={7}>
          <span>Price per session:</span>
        </Col>
        <Col className="text-end ps-0" xs={5}>
          {appliedCoupon?.code && factor?.originalPriceAmount ? (
            <span className="discounted-amount color-secondary">
              (
              {factor?.country?.curency_symbol +
                (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
              {("" + factor?.originalPriceAmount)?.includes(".")
                ? parseFloat("" + factor?.originalPriceAmount)?.toFixed(2)
                : factor?.originalPriceAmount}
              ){" "}
            </span>
          ) : null}
          <span>
            {factor?.country?.curency_symbol +
              (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
            {factor?.data?.price_amount
              ? ("" + factor?.data?.price_amount)?.includes(".")
                ? parseFloat("" + factor?.data?.price_amount)?.toFixed(2)
                : factor?.data?.price_amount
              : 0}
          </span>
        </Col>
      </Row>
    );
  };

  const renderRegularPrice = () => {
    return (
      <Row className="mt-3 border-top pt-3">
        <Col>
          <span>Regular price:</span>
        </Col>
        <Col className="text-end">
          <span>
            {factor?.country?.curency_symbol +
              (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
            {factor?.totalPrice
              ? ("" + factor?.totalPrice).includes(".")
                ? numberWithCommas(
                    parseFloat("" + factor?.totalPrice).toFixed(2)
                  )
                : numberWithCommas(factor?.totalPrice)
              : 0}
          </span>
        </Col>
      </Row>
    );
  };

  const getVatAmount = () => {
    if (factor?.upfront) {
      return factor?.totalPriceWithDiscount
        ? (
            "" +
            factor?.totalPriceWithDiscount * (factor.appliedTaxPercentage / 100)
          ).includes(".")
          ? numberWithCommas(
              "" +
                parseFloat(
                  "" +
                    factor?.totalPriceWithDiscount *
                      (factor.appliedTaxPercentage / 100)
                ).toFixed(2)
            )
          : numberWithCommas(
              factor?.totalPriceWithDiscount *
                (factor.appliedTaxPercentage / 100)
            )
        : 0;
    } else {
      return factor?.totalMonthlyPrice
        ? (
            "" +
            factor?.totalMonthlyPrice * (factor.appliedTaxPercentage / 100)
          ).includes(".")
          ? numberWithCommas(
              "" +
                parseFloat(
                  "" +
                    factor?.totalMonthlyPrice *
                      (factor.appliedTaxPercentage / 100)
                ).toFixed(2)
            )
          : numberWithCommas(
              factor?.totalMonthlyPrice * (factor.appliedTaxPercentage / 100)
            )
        : 0;
    }
  };

  const renderVarAmount = () => {
    return (
      <Row>
        <Col className="text-start">
          <span>VAT({factor?.appliedTaxPercentage}%):</span>
        </Col>
        <Col className="text-end">
          <span>
            {factor?.country?.curency_symbol +
              (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
            {getVatAmount()}
          </span>
        </Col>
      </Row>
    );
  };

  const renderUpfrontTotal = () => {
    return (
      <>
        {appliedCoupon?.code && !factor?.appliedTaxPercentage ? (
          <span className="discounted-amount color-secondary">
            (
            {factor?.country?.curency_symbol +
              (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
            {factor?.originalTotalPriceWithDiscount
              ? (
                  "" +
                  (factor?.originalTotalPriceWithDiscount +
                    (factor.appliedTaxPercentage
                      ? factor?.originalTotalPriceWithDiscount *
                        (factor.appliedTaxPercentage / 100)
                      : 0))
                ).includes(".")
                ? numberWithCommas(
                    parseFloat(
                      "" +
                        (factor?.originalTotalPriceWithDiscount +
                          (factor.appliedTaxPercentage
                            ? factor?.originalTotalPriceWithDiscount *
                              (factor.appliedTaxPercentage / 100)
                            : 0))
                    ).toFixed(2)
                  )
                : numberWithCommas(
                    factor?.originalTotalPriceWithDiscount +
                      (factor.appliedTaxPercentage
                        ? factor?.originalTotalPriceWithDiscount *
                          (factor.appliedTaxPercentage / 100)
                        : 0)
                  )
              : 0}
            ){" "}
          </span>
        ) : null}
        <span>
          {factor?.country?.curency_symbol +
            (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
          {factor?.totalPriceWithDiscount
            ? (
                "" +
                (factor?.totalPriceWithDiscount +
                  (factor.appliedTaxPercentage
                    ? factor?.totalPriceWithDiscount *
                      (factor.appliedTaxPercentage / 100)
                    : 0))
              ).includes(".")
              ? numberWithCommas(
                  "" +
                    parseFloat(
                      "" +
                        (factor?.totalPriceWithDiscount +
                          (factor.appliedTaxPercentage
                            ? factor?.totalPriceWithDiscount *
                              (factor.appliedTaxPercentage / 100)
                            : 0))
                    ).toFixed(2)
                )
              : numberWithCommas(
                  factor?.totalPriceWithDiscount +
                    (factor.appliedTaxPercentage
                      ? factor?.totalPriceWithDiscount *
                        (factor.appliedTaxPercentage / 100)
                      : 0)
                )
            : 0}
        </span>
      </>
    );
  };

  const renderMonthlyTotal = () => {
    return (
      <>
        {appliedCoupon?.code && !factor?.appliedTaxPercentage ? (
          <span className="discounted-amount color-seconday">
            (
            {factor?.country?.curency_symbol +
              (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
            {factor?.originalMonthlyPrice
              ? ("" + factor?.originalMonthlyPrice).includes(".")
                ? numberWithCommas(
                    parseFloat("" + factor?.originalMonthlyPrice).toFixed(2)
                  )
                : numberWithCommas(factor?.originalMonthlyPrice)
              : 0}
            ){" "}
          </span>
        ) : null}

        <span>
          {factor?.country?.curency_symbol +
            (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
          {factor?.totalMonthlyPrice
            ? (
                "" +
                (factor?.totalMonthlyPrice +
                  (factor.appliedTaxPercentage
                    ? factor?.totalMonthlyPrice *
                      (factor.appliedTaxPercentage / 100)
                    : 0))
              ).includes(".")
              ? numberWithCommas(
                  "" +
                    parseFloat(
                      "" +
                        (factor?.totalMonthlyPrice +
                          (factor.appliedTaxPercentage
                            ? factor?.totalMonthlyPrice *
                              (factor.appliedTaxPercentage / 100)
                            : 0))
                    ).toFixed(2)
                )
              : numberWithCommas(
                  factor?.totalMonthlyPrice +
                    (factor.appliedTaxPercentage
                      ? factor?.totalMonthlyPrice *
                        (factor.appliedTaxPercentage / 100)
                      : 0)
                )
            : 0}
        </span>
        <span className="color-secondary font-12">/month</span>
      </>
    );
  };

  const renderUpfrontSubTotal = () => {
    return (
      <>
        {!props?.package?.discount_pay || appliedCoupon?.code ? (
          <span className="discounted-amount color-secondary">
            (
            {factor?.country?.curency_symbol +
              (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
            {factor?.originalTotalPriceWithDiscount
              ? ("" + factor?.originalTotalPriceWithDiscount).includes(".")
                ? numberWithCommas(
                    parseFloat(
                      "" + factor?.originalTotalPriceWithDiscount
                    ).toFixed(2)
                  )
                : numberWithCommas(factor?.originalTotalPriceWithDiscount)
              : 0}
            ){" "}
          </span>
        ) : null}

        <span>
          {factor?.country?.curency_symbol +
            (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
          {factor?.totalPriceWithDiscount
            ? ("" + factor?.totalPriceWithDiscount).includes(".")
              ? numberWithCommas(
                  "" +
                    parseFloat("" + factor?.totalPriceWithDiscount).toFixed(2)
                )
              : numberWithCommas(factor?.totalPriceWithDiscount)
            : 0}
        </span>
      </>
    );
  };

  const renderMonthlySubTotal = () => {
    return (
      <>
        {appliedCoupon?.code ? (
          <span className="discounted-amount color-seconday">
            (
            {factor?.country?.curency_symbol +
              (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
            {factor?.originalMonthlyPrice
              ? ("" + factor?.originalMonthlyPrice).includes(".")
                ? numberWithCommas(
                    parseFloat("" + factor?.originalMonthlyPrice).toFixed(2)
                  )
                : numberWithCommas(factor?.originalMonthlyPrice)
              : 0}
            ){" "}
          </span>
        ) : null}

        <span>
          {factor?.country?.curency_symbol +
            (factor?.country?.iso.toUpperCase() === "AE" ? " " : "")}
          {factor?.totalMonthlyPrice
            ? ("" + factor?.totalMonthlyPrice).includes(".")
              ? numberWithCommas(
                  "" + parseFloat("" + factor?.totalMonthlyPrice).toFixed(2)
                )
              : numberWithCommas(factor?.totalMonthlyPrice)
            : 0}
        </span>
      </>
    );
  };

  const renderSubTotal = () => {
    return (
      <Row
        className={
          factor?.appliedTaxPercentage && !factor?.upfront
            ? "mt-3 border-top pt-3"
            : ""
        }
      >
        <Col className="text-start">
          <span>Subtotal:</span>
        </Col>
        <Col className="text-end">
          {factor?.upfront ? renderUpfrontSubTotal() : renderMonthlySubTotal()}
        </Col>
      </Row>
    );
  };

  const renderTotal = () => {
    return (
      <Row
        className={
          !factor.upfront && !factor?.appliedTaxPercentage
            ? "mt-3 border-top pt-3"
            : ""
        }
      >
        <Col className="text-start d-flex flex-column">
          <span>Total Price:</span>
          {/* <span className="color-secondary font-12">{factor?.data?.month} months</span> */}
        </Col>
        <Col className="text-end">
          {factor?.upfront ? renderUpfrontTotal() : renderMonthlyTotal()}
        </Col>
      </Row>
    );
  };

  const handleNavigateToFaq = (type: string) => {
    let url = type;
    if (selectedFranchise?.name) {
      url = `${selectedFranchise?.domain}/${type}`;
    }
    window.open(`${window.location.origin}/${url}`);
  };

  const renderCheckout = () => {
    return (
      <>
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
            type="button"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </Row>
      </>
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col lg={6} xs={12}>
          <Row>
            <Col className="d-flex flex-column">
              <span className="h3 color-primary pb-0 mb-0">
                {props?.package?.package_name}
              </span>
              <span className="h6 color-secondary pb-0 mb-0">
                {props?.package?.PackageType?.name}
              </span>
            </Col>
          </Row>
          <Row className="mt-3">
            {!props?.package?.isDynamicQuantity ? (
              <Col>
                <span>Sessions:</span>
                <span className="color-primary ms-4">
                  {props?.package?.quantity}
                </span>
                <span className="color-secondary font-12">
                  {factor?.data?.package_session_type !== "session"
                    ? "/" + props?.package?.quantity_times
                    : ""}
                </span>
              </Col>
            ) : (
              <Col>
                <Form.Group>
                  <Form.Label className="pb-0 mb-2">
                    Sessions/{props?.package?.quantity_times}
                  </Form.Label>
                  <Form.Select
                    disabled={!props?.package?.isDynamicQuantity}
                    onChange={(event: any) => {
                      setSelectedQuanity(event.target.value);
                    }}
                    value={selectedQuanity}
                  >
                    {getQuantityDropdownOptions()}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
          </Row>
          <Row className="mt-3">
            <Col>
              <p className="mb-0 h6 fw-ligher">Payment Mode</p>
              {props?.package?.discount_pay ? (
                <p className="mb-0 fw-ligher color-secondary discount-description mt-2">
                  How you would like to pay? You will get{" "}
                  {props?.package?.discount_pay}% discount by paying Upfront
                </p>
              ) : null}
              <Form.Group className="mt-2">
                {props?.package?.package_session_type !== "session" ? (
                  <Form.Check
                    type={"radio"}
                    label={"Monthly"}
                    name="paymentMode"
                    checked={selectedMode === "monthly"}
                    onChange={() => setSelectedMode("monthly")}
                    inline
                  />
                ) : null}

                <Form.Check
                  type={"radio"}
                  label={"Upfront"}
                  name="paymentMode"
                  className={
                    props?.package?.package_session_type !== "session"
                      ? "ms-sm-5"
                      : ""
                  }
                  onChange={() => setSelectedMode("upfront")}
                  checked={selectedMode === "upfront"}
                  inline
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Form.Group>
                <Form.Label className="pb-0 mb-0">Apply Coupon</Form.Label>
                <InputGroup className="mb-3 mt-2">
                  <Form.Control
                    placeholder="Enter coupon code"
                    aria-describedby="basic-addon2"
                    onChange={(event) => setCoupon(event.target.value)}
                    name="coupon"
                    value={coupon}
                    disabled={appliedCoupon?.code ? true : false}
                  />
                  <Button
                    className="background-primary border-color-primary text-white"
                    id="button-addon2"
                    onClick={() => applyCoupon()}
                  >
                    {appliedCoupon?.code ? "Remove" : "Apply"}
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Col>
        <Col className="position-relative" lg={6} xs={12}>
          <>
            {isLoadingData && (
              <div className="overlay-modal">
                <Spinner animation="grow" variant="info" />
              </div>
            )}
            <Row className="align-items-center justify-content-center h-100">
              <Col sm={10} xs={12} className="border rounded p-4">
                <Row>
                  <Col>
                    <p className="h4">Payment Breakdown</p>
                  </Col>
                </Row>
                {renderTotalCommitedSessions()}

                {renderPricePerSession()}

                {!factor?.upfront && renderSessionsPerMonth()}

                {factor?.data?.package_session_type !== "session"
                  ? renderTotalMonths()
                  : null}

                {factor?.upfront ? renderRegularPrice() : null}

                {factor?.appliedTaxPercentage &&
                ((factor?.upfront &&
                  (appliedCoupon?.code || props?.package?.discount_pay)) ||
                  !factor.upfront)
                  ? renderSubTotal()
                  : null}

                {factor?.appliedTaxPercentage ? renderVarAmount() : null}

                {renderTotal()}

                {factor?.publishableKey && user?.id && !user?.is_temp ? (
                  <Elements stripe={loadStripe(factor?.publishableKey)}>
                    <Checkout
                      handleCompleteCheckout={props?.handleCheckoutComplete}
                      setDoRegistration={props.setDoRegistration}
                      setIsLoadingData={setIsLoadingData}
                      onHide={props.onHide}
                    />
                  </Elements>
                ) : (
                  renderCheckout()
                )}
              </Col>
            </Row>
          </>
        </Col>
      </Row>
    </Container>
  );
};

PackageSummary.propTypes = {
  package: PropTypes.any,
  handleCheckoutComplete: PropTypes.func,
  setDoRegistration: PropTypes.func,
};

export { PackageSummary };
