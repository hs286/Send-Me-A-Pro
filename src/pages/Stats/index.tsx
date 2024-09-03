import React, { useEffect, useState } from "react";
import moment from "moment";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLogicPackage } from "../../hooks";
import { PackageStatsModal } from "../../redux";
import "./styles.css";

const Stats = () => {
  const packageStats = useSelector(
    (state: any) => state?.package?.allPackageStats
  );
  const [packageStatsLocal, setPackageStatsLocal] = useState<any>([]);
  const { profile } = useSelector((state: any) => state.user);
  const { getAllPackageStats } = useLogicPackage();

  useEffect(() => {
    let sortedPackageStats = packageStats?.sort((a: any, b: any) => {
      if (a.status < b.status) {
        return -1;
      }
      return 0;
    });
    setPackageStatsLocal(sortedPackageStats);
  }, [packageStats]);

  useEffect(() => {
    getAllPackageStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const renderPackageStatsCard = (
    packageStats: PackageStatsModal,
    index: number
  ) => {
    return (
      <Row
        className="border-bottom pt-5 pb-3"
        key={`package-${index}-${packageStats?.userPackage?.id}`}
      >
        <Col xs="12" className="mt-3 mt-md-0">
          <Row className="justify-content-between">
            <Col xs={9} md={10} className="pb-2">
              <div className="package-title">
                <span>{packageStats?.package?.package_name}</span>
              </div>
            </Col>
            <Col xs={3} md={2} className="pb-2">
              <p
                className={`${
                  packageStats?.status === "ACTIVE"
                    ? "text-success"
                    : packageStats?.status === "DEACTIVE"
                    ? "text-danger"
                    : packageStats?.status === "EXPIRED"
                    ? "text-danger"
                    : ""
                } text-end p-0 m-0`}
              >
                {packageStats?.status}
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" md="12" lg={"6"}>
              <ul className="stats-details-list">
                <li>
                  {/* <FontAwesomeIcon icon={faCalendar} className="stats-icons" /> */}
                  <span className="stats-details-span">
                    Purchased on:{" "}
                    {`${moment(packageStats?.userPackage?.created_at).format(
                      profile.Country?.iso === "US"
                        ? "MMMM Do YYYY"
                        : "Do MMMM YYYY"
                    )}`}
                  </span>
                </li>
                <li>
                  {/* <FontAwesomeIcon icon={faBoxOpen} className="stats-icons" /> */}
                  <span className="stats-details-span">
                    Session Length: {packageStats?.package?.PackageType?.name}
                  </span>
                </li>
                <li>
                  <span className="stats-details-span">
                    Session Per Month: {packageStats?.sessionsPerMonth}
                  </span>
                </li>
                <li>
                  <span className="stats-details-span">
                    Total Months: {packageStats?.totalMonths}
                  </span>
                </li>

                <li>
                  <span className="stats-details-span">
                    Total Commited Sessions:{" "}
                    {packageStats?.totalCommitedSessions}
                  </span>
                </li>
                <li>
                  <span className="stats-details-span">
                    Price Per Session: {profile?.Country?.curency_symbol}
                    {packageStats?.pricePerSession}
                  </span>
                </li>
                <li>
                  <span className="stats-details-span">
                    {packageStats?.paymentType}:{" "}
                    {profile?.Country?.curency_symbol}
                    {packageStats?.payableAmount}
                  </span>
                </li>
              </ul>
            </Col>
            <Col lg={"6"}>
              <Row className="pt-4 pt-lg-0">
                <Col>
                  <Row>
                    <Col
                      xs={4}
                      className="d-flex flex-column align-items-center"
                    >
                      <h5 className="m-0">{packageStats?.paidSessions}</h5>
                    </Col>
                    <Col
                      xs={4}
                      className="d-flex flex-column justify-content-end align-items-center color-primary"
                    >
                      <h5 className="m-0">{packageStats?.completedSessions}</h5>
                    </Col>
                    <Col
                      xs={4}
                      className="d-flex flex-column justify-content-end align-items-center"
                    >
                      <h5 className="m-0">
                        {packageStats?.remainingPaidSessions}
                      </h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={4}
                      className="d-flex flex-column align-items-center"
                    >
                      <hr className="w-50 detail-seperator" />
                    </Col>
                    <Col
                      xs={4}
                      className="d-flex flex-column justify-content-center align-items-center"
                    >
                      <hr className="w-50 detail-seperator" />
                    </Col>
                    <Col
                      xs={4}
                      className="d-flex flex-column justify-content-center align-items-center"
                    >
                      <hr className="w-50 detail-seperator" />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={4}
                      className="d-flex flex-column align-items-center"
                    >
                      <p className="text-center detail-text">Paid Sessions</p>
                    </Col>
                    <Col
                      xs={4}
                      className="d-flex flex-column align-items-center"
                    >
                      <p className="text-center detail-text">
                        Completed Sessions
                      </p>
                    </Col>
                    <Col
                      xs={4}
                      className="d-flex flex-column align-items-center"
                    >
                      <p className="text-center detail-text">
                        Remaining Paid Sessions
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <div className="package-subtitle text-center">
                      <span
                        className={`m-0 ${
                          packageStats?.status === "ACTIVE"
                            ? "text-success"
                            : packageStats?.status === "DEACTIVE"
                            ? "text-danger"
                            : packageStats?.status === "EXPIRED"
                            ? "text-danger"
                            : ""
                        }`}
                      >
                        {packageStats?.status_message}
                      </span>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <Container className="min-height-vh-75">
      <Row className="mt-3 justify-content-center">
        <Col xs="12" sm="12" md="7">
          <h3 className="text-uppercase fw-bolder">Program details</h3>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="session-container" xs="12" sm="12" md="7">
          {packageStatsLocal?.map((stats: PackageStatsModal, index: number) =>
            renderPackageStatsCard(stats, index)
          )}
        </Col>
      </Row>
    </Container>
  );
};

export { Stats };
