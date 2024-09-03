import React, { useEffect } from "react";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Image, Row } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { VERIFIED } from "../../assets/images";
import { useLogicManageTrainers, useLogicPackage } from "../../hooks";
import styles from "./ManagePros.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TrainerModal } from "../../redux";

const ManagePros = () => {
  const {
    activeTrainers,
    getAvailableTrainers,
    onArchiveTrainer,
    onUnarchiveTrainer,
  } = useLogicManageTrainers();
  const { checkUserHasActivePackage } = useLogicPackage();
  const { profile } = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (profile?.id) {
      getAvailableTrainers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const handleNavigateToMessage = async (trainerProfile: any) => {
    if (trainerProfile?.id) {
      if (await !checkUserHasActivePackage()) {
        navigate(`/messages/support`);
      } else {
        navigate(
          `/messages/${trainerProfile?.id}/${trainerProfile?.firstname}/${
            trainerProfile?.lastname?.charAt(0) + "."
          }`
        );
      }
    }
  };

  const renderTrainerProfile = (item: any, flag = false, index: number) => {
    let {
      trainerInfo,
      totalRating,
    }: { trainerInfo: TrainerModal; totalRating: Number } = item;
    return (
      <Row className="justify-content-center">
        <Col lg="8">
          <Row
            key={12}
            className={`${flag ? "p-3" : "border-bottom p-3"} ${
              index === 0 ? "mt-5" : " "
            }`}
          >
            <Col
              xxl="3"
              xl="3"
              lg="3"
              md="3"
              sm="12"
              xs="12"
              className="d-flex justify-content-center align-items-center flex-column"
            >
              <div
                role="button"
                className={
                  styles.trainer_profile_image + " no-background no-border"
                }
              >
                <Image
                  src={trainerInfo?.avatar || ""}
                  alt="trainer"
                  className="trainer-profile-image"
                  roundedCircle
                />
              </div>
            </Col>
            <Col xxl="9" xl="9" lg="9" md="9" sm="12" xs="12" className="mt-3">
              <Row>
                <Col xs={8}>
                  <div className="trainer-title">
                    <span>
                      {trainerInfo?.firstname + " " + trainerInfo?.lastname}
                    </span>
                    <Image src={VERIFIED} alt="verified" />
                  </div>
                  <div className="ratings d-flex align-items-end">
                    <StarRatings
                      rating={
                        totalRating
                          ? Number(parseFloat("" + totalRating).toFixed(1))
                          : 5
                      }
                      starRatedColor="#06BED8"
                      starHoverColor="#06BED8"
                      starEmptyColor="#8a8a8a"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="3px"
                      name="rating"
                    />
                    <span className="ms-2 color-secondary">
                      {totalRating
                        ? Number(parseFloat("" + totalRating).toFixed(1))
                        : 5}
                    </span>
                  </div>
                  <div className="profile-location color-secondary mt-2">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="divor-secondary"
                    />
                    <span>{`${trainerInfo?.City?.name}, ${trainerInfo?.State?.name}`}</span>
                  </div>
                </Col>
                <Col xs={4} className="d-flex flex-column">
                  <button
                    className={`${styles.archive_btn} btn no-background color-primary mt-1`}
                    onClick={() =>
                      item?.status === "TRAINER_ARCHIVE"
                        ? onUnarchiveTrainer(item?.id)
                        : onArchiveTrainer(item?.id)
                    }
                  >
                    {item?.status === "TRAINER_ARCHIVE"
                      ? "Unarchive"
                      : "Archive"}
                  </button>
                  <button
                    className="package-price-btn btn background-primary text-white mt-1"
                    onClick={() => {
                      handleNavigateToMessage(trainerInfo);
                    }}
                  >
                    Message
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };
  return (
    <Container className={styles.trainer_list_container}>
      <Row className="mt-3 justify-content-center">
        <Col className="p-0" lg="8">
          <h3 className="p-0 m-0 text-uppercase fw-bolder">Manage Pros</h3>
        </Col>
      </Row>
      {activeTrainers?.map((activeTrainer: any, index: number) => {
        return renderTrainerProfile(
          activeTrainer,
          index === activeTrainers?.length - 1,
          index
        );
      })}
    </Container>
  );
};

export { ManagePros };
