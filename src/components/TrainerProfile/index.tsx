import React from "react";
import { faEdit, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import {
  CATEGORIES,
  CERTIFICATE,
  LANGUAGE,
  SPECIALITIES,
  VERIFIED,
} from "../../assets/images";
import "./style.css";
import { TrainerModal } from "../../redux";
import PropTypes from "prop-types";
import moment from "moment";
import { FullImageModal } from "../FullImageModal";
interface TrainerProfileProps {
  profile?: TrainerModal | undefined;
}

const TrainerProfile = (props: TrainerProfileProps) => {
  const [reviewsPublished, setReviewsPublished]: any = React.useState([]);
  const [notEmptyReviews, setNotEmptyReviews]: any = React.useState([]);
  const [finalRating, setFinalRating] = React.useState(0);
  const [fullImageSource, setFullImageSource] = React.useState<any>(null);

  React.useEffect(() => {
    let reviewsByTrainerId = props.profile?.TrainerReviews;
    let publishedReviews =
      reviewsByTrainerId?.length &&
      reviewsByTrainerId?.filter((review: any) => review.publish === true);
    setReviewsPublished(publishedReviews || []);
    let filterEmptyReviews =
      reviewsByTrainerId?.length &&
      reviewsByTrainerId.filter(
        (review: any) => review.note !== null && review.publish === true
      );
    setNotEmptyReviews(filterEmptyReviews);
  }, [props.profile?.TrainerReviews]);

  const progressBar = [1, 2, 3, 4, 5];

  const calculateRaing = (totalStars = 1, gainStars = 1) => {
    if (gainStars === 0 || totalStars === 0) {
      if (finalRating !== 5) {
        setFinalRating(5);
      }
    } else {
      let Rating = (gainStars / totalStars) * 5;
      Rating = parseFloat(Rating.toFixed(1));
      if (finalRating !== Rating) {
        setFinalRating(Rating);
      }
    }
  };

  const renderTitle = () => {
    return (
      <Row>
        <Col xs="11" className="tp-trainer-title">
          <span>{`${props?.profile?.firstname} ${
            props?.profile?.lastname?.charAt(0) + "." || ""
          }`}</span>
          <Image src={VERIFIED} alt="verified" />
        </Col>
        <Col xs="1">
          <FontAwesomeIcon icon={faEdit} className="ms-2" />
        </Col>
        <Col xs="12">
          <span className="tp-description color-secondary">
            {props?.profile?.TrainerDetails?.title}, Since{" "}
            {props?.profile?.TrainerDetails?.start_year}
          </span>
        </Col>
      </Row>
    );
  };
  const renderStartRating = () => {
    return (
      <Row>
        <Col className="tp-ratings">
          <StarRatings
            rating={finalRating || 5}
            starRatedColor="#06BED8"
            starHoverColor="#06BED8"
            starEmptyColor="#8a8a8a"
            numberOfStars={5}
            starDimension="20px"
            starSpacing="3px"
            name="rating"
          />
          <span className="ms-2">({finalRating || 5})</span>
        </Col>
      </Row>
    );
  };
  const renderLocation = () => {
    return (
      <Row>
        <Col className="tp-location mt-2">
          <FontAwesomeIcon className="color-secondary" icon={faLocationDot} />
          <span className="color-secondary">{`${props?.profile?.City?.name}, ${props?.profile?.State?.name}`}</span>
        </Col>
      </Row>
    );
  };
  const renderBio = () => {
    return (
      <Row>
        <Col xs="11" className="tp-bio">
          <p>{props?.profile?.TrainerDetails?.bio}</p>
        </Col>
        <Col xs="1" className="d-flex justify-content-end">
          <FontAwesomeIcon icon={faEdit} className="ms-2" />
        </Col>
      </Row>
    );
  };
  const renderCategories = () => {
    return (
      <Row>
        <Col className="tp-categories">
          <div className="tp-categories-title">
            <Image src={CATEGORIES} alt="categories" />
            <span>Categories:</span>
          </div>
          <div className="tp-category-chips-container">
            {props?.profile?.TrainerDetails?.Categories?.map(
              (trainer_category) => {
                return (
                  <span key={trainer_category?.id}>
                    {trainer_category?.Category?.name}
                  </span>
                );
              }
            )}
          </div>
        </Col>
      </Row>
    );
  };
  const renderCertificates = () => {
    return (
      <Row>
        <Col className="categories col-12">
          <div className="tp-categories-title">
            <img src={CERTIFICATE} alt="certificates" />
            <span>Certificates:</span>
          </div>
          <div className="tp-category-chips-container">
            {props?.profile?.TrainerDetails?.Certifications?.map(
              (trainer_certificate) => {
                return (
                  <span key={trainer_certificate?.id}>
                    {trainer_certificate?.Certification?.name}
                  </span>
                );
              }
            )}
          </div>
        </Col>
      </Row>
    );
  };
  const renderSpecialities = () => {
    return (
      <Row>
        <Col className="tp-categories">
          <div className="tp-categories-title">
            <Image src={SPECIALITIES} alt="specialities" />
            <span>Specialities:</span>
          </div>
          <div className="tp-category-chips-container">
            {props?.profile?.TrainerDetails?.Specialities?.map(
              (trainer_speciality) => {
                return (
                  <span key={trainer_speciality?.id}>
                    {trainer_speciality?.Speciality?.name}
                  </span>
                );
              }
            )}
          </div>
        </Col>
      </Row>
    );
  };
  const renderLanguages = () => {
    return (
      <Row>
        <Col className="tp-categories">
          <div className="tp-categories-title">
            <img src={LANGUAGE} alt="languages" />
            <span>LANGUAGES:</span>
          </div>
          <div className="tp-category-chips-container">
            {props?.profile?.TrainerDetails?.Languages?.map(
              (trainer_language) => {
                return (
                  <span key={trainer_language?.id}>
                    {trainer_language?.Language?.name}
                  </span>
                );
              }
            )}
          </div>
        </Col>
      </Row>
    );
  };
  const renderRatings = () => {
    return (
      <Row className="mt-5">
        <Col xs="2" className="ratings-container">
          <p className="p-0 m-0 font-family-poppins tp-ratting-text">
            {finalRating || 5}
          </p>
          <p className="p-0 m-0 font-family-poppins tp-ratting-out-of">
            out of 5
          </p>
        </Col>
        <Col className="d-flex flex-column-reverse">
          {progressBar.length &&
            progressBar.map((review, index) => {
              let addRating = 0;
              let DefratingProgress =
                reviewsPublished.length &&
                reviewsPublished.filter((review: any) => {
                  addRating = addRating + review?.rating;
                  return review?.rating === index + 1;
                }).length;
              if (index === 4) {
                calculateRaing(reviewsPublished.length * 5, addRating);
              }
              DefratingProgress =
                (DefratingProgress / reviewsPublished.length) * 100;
              return (
                <Row>
                  <Col
                    xxl="5"
                    xl="5"
                    lg="5"
                    md="5"
                    sm="5"
                    xs="6"
                    className="d-flex justify-content-end"
                  >
                    <StarRatings
                      rating={index + 1}
                      starRatedColor="#06BED8"
                      starHoverColor="#06BED8"
                      starEmptyColor="#06BED8"
                      numberOfStars={index + 1}
                      starDimension="20px"
                      starSpacing="3px"
                      name="rating"
                    />
                  </Col>
                  <Col xxl="7" xl="7" lg="7" md="7" sm="7" xs="6">
                    <div className="progress rating-bar">
                      <div
                        className="progress-bar"
                        style={{ width: `${DefratingProgress.toString()}%` }}
                        role="progressbar"
                        aria-valuenow={80}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </Col>
                </Row>
              );
            })}
        </Col>
      </Row>
    );
  };

  const renderReviews = () => {
    if (notEmptyReviews?.length) {
      return (
        <>
          <Row className="mt-2">
            <Col className="tp-categories">
              <div className="tp-categories-title">
                <span>Reviews</span>
              </div>
            </Col>
          </Row>
          <Row className="border rounded p-2 mt-2">
            {notEmptyReviews.length &&
              notEmptyReviews.map((review: any) => {
                return (
                  <Col md={6} xs={12} className="mt-2">
                    <div className="background-secondary rounded p-2 d-flex flex-column">
                      <div className="client-name-date d-flex justify-content-between">
                        <span>
                          {review?.user_name
                            ? `${review?.user_name.split(" ")[0]} ${
                                review?.user_name.split(" ")[1]
                                  ? review?.user_name.split(" ")[1].substr(0, 1)
                                  : ""
                              }`
                            : `${review?.userInfo?.firstname} ${
                                review?.userInfo?.lastname
                                  ? review?.userInfo?.lastname?.charAt(0) + "."
                                  : ""
                              }`}
                        </span>
                        <span>
                          {moment(review.review_date).format("MMMM YYYY")}
                        </span>
                      </div>
                      <div className="stars mt-2">
                        <StarRatings
                          rating={review.rating}
                          starRatedColor="#06BED8"
                          starHoverColor="#06BED8"
                          starEmptyColor="#8a8a8a"
                          numberOfStars={5}
                          starDimension="20px"
                          starSpacing="3px"
                          name="rating"
                        />
                      </div>
                      <div className="review-text mt-2">{review.note}</div>
                    </div>
                  </Col>
                );
              })}
          </Row>
        </>
      );
    }
  };

  return (
    <Container className="mt-2">
      <Row className="align-items-center pb-3">
        <Col xxl="4" xl="4" lg="4" className="d-flex justify-content-center">
          <Button
            className="tp-trainer-profile-image no-background no-border"
            onClick={() =>
              setFullImageSource(
                props?.profile?.avatar ||
                  "https://images.ctfassets.net/psi7gc0m4mjv/6vL20yPWnuuJNvPtnG5KkO/788d1e4e39fccdb3abfed21fd465f2e4/master_personal_trainer_mobile_hero_image_2x.jpg"
              )
            }
          >
            <Image
              src={
                props?.profile?.avatar ||
                "https://images.ctfassets.net/psi7gc0m4mjv/6vL20yPWnuuJNvPtnG5KkO/788d1e4e39fccdb3abfed21fd465f2e4/master_personal_trainer_mobile_hero_image_2x.jpg"
              }
              alt="trainer"
              className="trainer-profile-image"
              roundedCircle
            />
          </Button>
        </Col>
        <Col xxl="8" xl="8" lg="8">
          {renderTitle()}
          {renderStartRating()}
          {renderLocation()}
        </Col>
      </Row>
      <Row>
        <Col>
          {renderBio()}
          {renderCategories()}
          {renderSpecialities()}
          {renderCertificates()}
          {renderLanguages()}
          {renderRatings()}
          {renderReviews()}
        </Col>
      </Row>
      <FullImageModal
        show={fullImageSource ? true : false}
        image={fullImageSource}
        onHide={() => setFullImageSource(null)}
      />
    </Container>
  );
};

TrainerProfile.propTypes = {
  profile: PropTypes.any,
};

export { TrainerProfile };
