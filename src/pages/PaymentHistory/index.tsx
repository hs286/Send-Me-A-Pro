import moment from "moment";
import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, getUserPaymentHistoryAction } from "../../redux";
import "./style.css";

const PaymentHistory = () => {
  const { userPaymentsHistory } = useSelector((state: any) => state.package);
  const { profile } = useSelector((state: any) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (profile?.id) {
      dispatch(getUserPaymentHistoryAction(profile?.id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const getSessionsCount = (paymentDetails: any) => {
    const packageSessionType =
      paymentDetails?.package_payments?.user_package?.package
        ?.package_session_type || "N/A";
    let paidSessions = 0;
    let sessionsPerMonth = 0;
    if (packageSessionType === "N/A") {
      return "N/A";
    }
    if (packageSessionType === "session") {
      if (paymentDetails?.package_payments?.user_package?.upfront === true) {
        // session upfront
        paidSessions = paymentDetails?.package_payments?.user_package?.quantity;
      } else {
        // session monthly
        sessionsPerMonth =
          paymentDetails?.package_payments?.user_package?.quantity;
      }
    } else {
      let times =
        paymentDetails?.package_payments?.user_package?.quantity_times ===
        "month"
          ? 1
          : 4;
      if (paymentDetails?.package_payments?.user_package?.upfront === true) {
        // upfront
        paidSessions =
          paymentDetails?.package_payments?.user_package?.month *
          (paymentDetails?.package_payments?.user_package?.quantity * times);
      } else {
        // monthly
        sessionsPerMonth =
          paymentDetails?.package_payments?.user_package?.quantity * times;
      }
    }

    if (paidSessions > 0) {
      return `${paidSessions} Sessions`;
    } else {
      return `${sessionsPerMonth} Sessions/month`;
    }
  };

  const renderPaymentHistoryCard = (
    borderBottom = true,
    item: any,
    index: number
  ) => {
    return (
      <Row
        key={index}
        className={`mt-5 pb-4 ${borderBottom ? "border-bottom" : ""}`}
      >
        <Col
          xs="2"
          className={`d-flex flex-column align-items-center justify-content-center rounded ${
            item?.payment_info?.status === "succeeded"
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          <p className="p-0 m-0 text-center text-white text-uppercase">
            {item?.payment_info?.status || "N/A"}
          </p>
        </Col>
        <Col xs="10">
          <Row>
            <Col xs="8">
              <p className="p-0 m-0">
                {item?.package_payments?.user_package?.package?.package_name ||
                  "N/A"}
              </p>
            </Col>
            <Col xs="4">
              <p className="p-0 m-0 text-end">
                {item?.payment_info?.amount
                  ? `$${item?.payment_info?.amount / 100}`
                  : "N/A"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="p-0 m-0 font-14 text-secondary">
                {moment(item?.created_at).format(
                  profile?.Country?.iso === "US" ? "MM/DD/YYYY" : "DD/MM/YYYY"
                )}
              </p>
            </Col>
            <Col>
              <p className="p-0 m-0 font-14 text-secondary text-end">
                {getSessionsCount(item)}
                {/* 20 Sessions/month */}
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Container className="min-height-vh-75">
        <Row className="mt-3 justify-content-center">
          <Col className="p-0" xs="12" md="10" lg="8" xl="6">
            <h3 className="p-0 m-0 text-uppercase fw-bolder">
              Payment History
            </h3>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col
            className="payment-history-container"
            xs="12"
            md="10"
            lg="8"
            xl="6"
          >
            {userPaymentsHistory?.map((payment: any, index: number) => {
              return renderPaymentHistoryCard(
                userPaymentsHistory?.length - 1 !== index,
                payment,
                index
              );
            })}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export { PaymentHistory };
