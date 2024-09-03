import React, { useCallback, useEffect, useState } from "react";
import {
  faBoxOpen,
  faCalendar,
  faCancel,
  faGrip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  Container,
  Image,
  Offcanvas,
  Row,
  Form,
  Spinner,
} from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  sessionParams,
  StateSession,
  UpdateStateSession,
} from "../../redux";
import {
  getSessionsAction,
  resetSessionsListAction,
  setReviewAction,
  updateSessionAction,
  updateSessionInStoreAction,
} from "../../redux/actions/sessionsActions";
import { useLogicPackage } from "../../hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import moment from "moment";
import "./styles.css";

const Sessions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showSessionDetails, setShowSessionDetails] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<any>({});
  const [selectedPackage, setSelectedPackage] = useState<any>("-1");
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [eligiablePackages, setEligiablePackages] = useState<Array<any>>([]);
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const { sessionsList, currentPage, totalPages } = useSelector(
    (state: any) => state.sessions
  );
  const { profile } = useSelector((state: any) => state.user);
  const { getEligiablePackageList, getPackageStats } = useLogicPackage();

  const fetchUserSessionsList = useCallback(async () => {
    await dispatch(getSessionsAction(currentPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    fetchUserSessionsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserEligiablePackages = useCallback(async () => {
    let res = await getEligiablePackageList(
      selectedSession.package_type_id,
      selectedSession.category_id
    );
    setEligiablePackages(res);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession.package_type_id, selectedSession.category_id]);

  useEffect(() => {
    if (selectedSession?.package_type_id) {
      fetchUserEligiablePackages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession]);

  useEffect(() => {
    if (selectedPackage !== "-1") {
      getPackageStats(+selectedPackage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPackage]);

  const approveOrRejectSession = async (status: any) => {
    if (status === UpdateStateSession.CLIENT_APPROVE) {
      if (selectedPackage === "-1") {
        toast.error("Please select a package");
        return;
      }
      if (rating === 0) {
        toast.error("Please select rating");
        return;
      }
    }
    if (status === UpdateStateSession.CLIENT_REJECT) {
      if (review === "") {
        toast.error("Please enter explaanation to continue.");
        return;
      }
    }
    let update: sessionParams = {
      request_opportunity_id: selectedSession.id,
      location: selectedSession.location,
      session_date: selectedSession?.session_date
        ?.toString()
        .replace("T", " ")
        .replace(":00.000Z", ""),
      late_cancel: selectedSession.late_cancel,
      message: selectedSession.message,
      status: status,
    };
    if (status === UpdateStateSession.CLIENT_APPROVE) {
      update.user_package_id = +selectedPackage;
    }
    if (status === UpdateStateSession.CLIENT_REJECT) {
      update.message = review;
    }
    const res: any = await dispatch(
      updateSessionAction(update, selectedSession.id)
    );
    if (res) {
      dispatch(updateSessionInStoreAction(res, res.id));
    }
    if (status === UpdateStateSession.CLIENT_APPROVE) {
      if (res) {
        submit(update);
      }
    } else {
      setReview("");
      setShowRejectModal(false);
    }
  };

  const submit = async (sessionData: sessionParams) => {
    const trainerId: number = selectedSession.requestOpportunity.trainerInfo.id;
    const finalReview: any = {
      user_id: profile?.id,
      trainer_id: trainerId,
      rating: rating,
      note: review,
    };

    const res: any = await dispatch(setReviewAction(finalReview, sessionData));
    if (res) {
      setRating(0);
      setReview("");
      onHideApproveModal();
    }
  };

  const renderSessionCard = (
    session: any,
    flag = false,
    hideButtons = false
  ) => {
    const user = session?.requestOpportunity?.trainerInfo || {};
    return (
      <Row className={`${flag ? "border-bottom" : ""} pt-5 pb-3`}>
        <Col
          md="3"
          sm="12"
          xs="12"
          className="d-flex justify-content-center align-items-center"
        >
          <div
            role="button"
            className="trainer-profile-image no-background no-border"
            onClick={() => {}}
          >
            <Image
              src={user.avatar || ""}
              alt="trainer"
              className="trainer-profile-image"
              roundedCircle
            />
          </div>
        </Col>
        <Col md="9" sm="12" xs="12" className="mt-3 mt-md-0">
          <Row className="justify-content-between">
            <Col
              xxl={4}
              xl={4}
              lg={5}
              md={5}
              sm={12}
              xs={12}
              className="border-bottom pb-2"
            >
              <div className="trainer-title">
                <span>{`${user.firstname} ${
                  user.lastname?.charAt(0) + "."
                }`}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" md="12" lg={!hideButtons ? "6" : "12"}>
              <ul className="session-details-list">
                {session?.late_cancel && (
                  <li>
                    <FontAwesomeIcon
                      icon={faCancel}
                      className="sessions-icons color-primary"
                    />
                    <span className="sessions-details-span color-primary">
                      Late Cencel
                    </span>
                  </li>
                )}
                <li>
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="sessions-icons"
                  />
                  <span className="sessions-details-span">
                    {`  ${moment(session.session_date).format(
                      profile.Country?.iso === "US"
                        ? "MMMM Do YYYY, h:mm A"
                        : "Do MMMM YYYY, h:mm A"
                    )}`}
                  </span>
                </li>
                <li>
                  <FontAwesomeIcon
                    icon={faBoxOpen}
                    className="sessions-icons"
                  />
                  <span className="sessions-details-span">
                    {session?.PackageType?.name || "N/A"}
                  </span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faGrip} className="sessions-icons" />
                  <span className="sessions-details-span">
                    {session?.Categories?.name || "N/A"}
                  </span>
                </li>
              </ul>
            </Col>
            {!hideButtons ? (
              <Col xs="12" sm="12" md="12" lg="6">
                <ul className="session-details-list">
                  {session.status === StateSession.NEW ? (
                    <>
                      <li>
                        <Button
                          className="background-secondary no-border text-danger w-100"
                          onClick={() => {
                            setSelectedSession(session);
                            setShowRejectModal(true);
                          }}
                        >
                          Reject
                        </Button>
                      </li>
                      <li>
                        <Button
                          className="background-primary no-border mt-2 w-100"
                          onClick={() => {
                            setSelectedSession(session);
                            setShowSessionDetails(true);
                          }}
                        >
                          Approve
                        </Button>
                      </li>
                    </>
                  ) : (
                    <>
                      {session.status?.replace(/_/g, " ") ===
                      "CLIENT APPROVE" ? (
                        <li>
                          <Button className="btn-success no-border w-100">
                            Client Apporved
                          </Button>
                        </li>
                      ) : (
                        <li>
                          <Button className="btn-danger no-border w-100">
                            Client Rejected
                          </Button>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>
    );
  };

  const onHideRejectModal = () => {
    setShowRejectModal(false);
    setReview("");
  };

  const onHideApproveModal = () => {
    setShowSessionDetails(!showSessionDetails);
    setSelectedPackage("-1");
    setSelectedSession({});
    setRating(0);
    setReview("");
  };

  const onRefresh = () => {
    if (!showRejectModal && !showSessionDetails) {
      dispatch(resetSessionsListAction());
      dispatch(getSessionsAction(1));
    }
  };

  const renderSessionDetailsCanvas = () => {
    return (
      <Offcanvas
        scroll={false}
        show={showSessionDetails}
        id="trainer-profile-sidebar"
        placement="end"
        onHide={onHideApproveModal}
        backdrop={true}
      >
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          {renderSessionCard(selectedSession, true, true)}
          <Row>
            <Col xs="12" className="mt-3">
              <Form.Label>Package *</Form.Label>
              <Form.Select
                value={selectedPackage}
                onChange={(event) => {
                  setSelectedPackage(event.target.value);
                }}
              >
                <option value={"-1"} disabled selected>
                  Please select one package
                </option>
                {eligiablePackages?.map((eligiablePackage: any) => {
                  return (
                    <option value={eligiablePackage.id}>
                      {eligiablePackage.display}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            <Col xs="12" className="mt-4">
              <Form.Label className="w-100">Tap to Rate</Form.Label>
              <StarRatings
                rating={rating}
                changeRating={(data) => setRating(data)}
                starRatedColor="#06bed8"
                starHoverColor="#06bed8"
                numberOfStars={5}
                starDimension="30px"
                starSpacing="10px"
                name="rating"
              />
            </Col>

            <Col xs="12" className="mt-4">
              <Form.Label>Leave a Review</Form.Label>
              <Form.Control
                as={"textarea"}
                rows={8}
                value={review}
                onChange={(event) => {
                  setReview(event.target.value);
                }}
                placeholder="Support your trainer by leaving them a review"
              />
            </Col>
          </Row>

          <Row>
            <Col xs="6" className="mt-4">
              <Button
                className="background-secondary no-border w-100 text-black"
                onClick={onHideApproveModal}
              >
                Cancel
              </Button>
            </Col>
            <Col xs="6" className="mt-4">
              <Button
                onClick={() =>
                  approveOrRejectSession(UpdateStateSession.CLIENT_APPROVE)
                }
                className="background-primary no-border w-100"
              >
                Apporve
              </Button>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    );
  };

  const renderRejectSessionCanvas = () => {
    return (
      <Offcanvas
        scroll={false}
        show={showRejectModal}
        id="trainer-profile-sidebar"
        placement="end"
        onHide={onHideRejectModal}
        backdrop={true}
      >
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
            <Col xs="12" className="mt-4">
              <Form.Label>
                Explain why you did not confirm that you completed this session
                and the admin will review
              </Form.Label>
              <Form.Control
                as={"textarea"}
                rows={8}
                value={review}
                onChange={(event) => {
                  setReview(event.target.value);
                }}
                placeholder="Enter explanation here."
              />
            </Col>
          </Row>

          <Row className="w-100 position-absolute bottom-0 mb-2">
            <Col xs="6" className="mt-4">
              <Button
                className="background-secondary no-border w-100 text-black"
                onClick={onHideRejectModal}
              >
                Cancel
              </Button>
            </Col>
            <Col xs="6" className="mt-4">
              <Button
                onClick={() =>
                  approveOrRejectSession(UpdateStateSession.CLIENT_REJECT)
                }
                className="btn-danger no-border w-100"
              >
                Reject
              </Button>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    );
  };

  return (
    <Container className="min-height-vh-75">
      <Row className="mt-3 justify-content-center">
        <Col xs="12" sm="12" md="8">
          <h3 className="text-uppercase fw-bolder">sessions</h3>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="session-container" xs="12" sm="12" md="8">
          <InfiniteScroll
            dataLength={sessionsList?.length || 0}
            next={fetchUserSessionsList}
            hasMore={currentPage <= totalPages}
            loader={
              <p className="text-center mt-2">
                <Spinner animation="grow" variant="info" />
              </p>
            }
            endMessage={
              <p className="text-center mt-2">
                <b>Yay! You have seen it all</b>
              </p>
            }
            // below props only if you need pull down functionality
            refreshFunction={onRefresh}
            pullDownToRefresh={!showRejectModal && !showSessionDetails}
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8595; Pull down to refresh
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8593; Release to refresh
              </h3>
            }
          >
            {sessionsList && sessionsList?.length > 0 ? (
              sessionsList.map((session: any) => {
                return renderSessionCard(session, true);
              })
            ) : (
              <></>
            )}
          </InfiniteScroll>
        </Col>
      </Row>
      {renderSessionDetailsCanvas()}
      {renderRejectSessionCanvas()}
    </Container>
  );
};

export { Sessions };
