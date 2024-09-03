import React, { useCallback, useEffect } from "react";
import {
  faEdit,
  faLocationDot,
  faUniversity,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
// import StarRatings from "react-star-ratings";
import {
  CATEGORIES,
  CERTIFICATE,
  IC_BOX,
  IC_SELECT,
  IC_TICK,
  LANGUAGE,
  SPECIALITIES,
  VERIFIED,
} from "../../assets/images";
// import "./style.css";
import styles from "./styles.module.css";
import {
  AppDispatch,
  CountryModal,
  TrainerModal,
  getProfileDataAction,
  // addCertificatesAction,
  // addSpecialityAction,
  getTrainerCategories,
  getTrainerCertificates,
  getTrainerLanguages,
  getTrainerSpecialities,
  postTrainerAddDetailsAction,
  updateUserBankDetailsAction,
} from "../../redux";
import PropTypes from "prop-types";
// import moment from "moment";
import { FullImageModal, PrimaryModal } from "..";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import { SET_USER } from "../../redux/types";
interface TrainerProfileProps {
  profile?: TrainerModal | undefined;
}

const ProviderProfile = (props: TrainerProfileProps) => {
  const {
    trainerSpecialities,
    trainerCertificates,
    trainerLanguages,
    trainerCategories,
    // newSpeciality,
    // newCertificate,
  } = useSelector((state: any) => state.trainers);
  const { profile } = useSelector((state: any) => state.user);
  const { countries } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [
    ,
    // reviewsPublished,
    setReviewsPublished,
  ]: any = React.useState([]);
  const [
    ,
    // notEmptyReviews,
    setNotEmptyReviews,
  ]: any = React.useState([]);
  const [year, setYear] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  // const [
  //   selectedCountryLocal,
  //   // setSelectedCountryLocal
  // ] = React.useState("");
  // const [
  //   accountNumber,
  //   // setAccountNumber
  // ] = React.useState("");
  // const [
  //   routingNumber,
  //   // setRoutingNumber
  // ] = React.useState("");
  // const [
  //   accountHolderName,
  //   // setAccountHolderName
  // ] = React.useState("");
  // const [
  //   accountHolderType,
  //   // setAccountHolderType
  // ] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [isProfessionDetailModalOpen, setIsProfessionDetailModalOpen] =
    React.useState(false);
  const [isProfessionBioModalOpen, setIsProfessionBioModalOpen] =
    React.useState(false);
  const [isBankDetailModalOpen, setIsBankDetailModalOpen] =
    React.useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = React.useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = React.useState(false);
  const [isCertificatesModalOpen, setIsCertificatesModalOpen] =
    React.useState(false);
  const [isSpecialitiesModalOpen, setIsSpecialitiesModalOpen] =
    React.useState(false);
  // const [
  //   finalRating,
  //   setFinalRating
  // ] = React.useState(0);
  const [errors, setErrors] = React.useState<any>({
    selectedCountryLocalError: "",
    accountNumberError: "",
    routingNumberError: "",
    accountHolderNameError: "",
    firstNameError: "",
    lastNameError: "",
    passwordError: "",
    confirmPasswordError: "",
    addressError: "",
    zipCodeError: "",
    stateError: "",
    emailError: "",
    phoneError: "",
    dobError: "",
    SSNError: "",
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [accountNumber, setAccountNumber] = React.useState<string>("");
  const [routingNumber, setRoutingNumber] = React.useState<string>("");
  const [accountHolderType] = React.useState<string>("individual");
  const [accountHolderName, setAccountHolderName] = React.useState<string>("");
  const [selectedCountryLocal, setSelectedCountryLocal] =
    React.useState<number>(-1);
  const [
    search,
    // setSearch
  ] = React.useState("");
  const [fullImageSource, setFullImageSource] = React.useState<any>(null);
  const [languageOption, setLanguageOption] = React.useState<any>([]);
  const [categoriesOption, setCategoriesOption] = React.useState<any>([]);
  const [specialitiesOption, setSpecialitiesOption] = React.useState<any>([]);
  const [certificatesOption, setCertificatesOption] = React.useState<any>([]);
  const [prevCategoriesCheck, setPrevCategoriesCheck] =
    React.useState<boolean>(false);
  const [prevSpecialitiesCheck, setPrevSpecialitiesCheck] =
    React.useState<boolean>(false);
  const [prevLanguagesCheck, setPrevLanguagesCheck] =
    React.useState<boolean>(false);
  const [prevCertificatesCheck, setPrevCertificatesCheck] =
    React.useState<boolean>(false);
  const [selectedSpecialities, setSelectedSpecialities] = React.useState<any>(
    []
  );
  const [selectedCerificates, setSelectedCerificates] = React.useState<any>([]);
  const years: any = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i);
  }

  React.useEffect(() => {
    if (props?.profile?.TrainerDetails?.title) {
      setTitle(props?.profile?.TrainerDetails?.title);
      setIsLoading(false);
    }
  }, [props?.profile?.TrainerDetails?.title]);

  React.useEffect(() => {
    if (props?.profile?.TrainerDetails?.start_year) {
      setYear(props?.profile?.TrainerDetails?.start_year);
    }
  }, [props?.profile?.TrainerDetails?.start_year]);

  React.useEffect(() => {
    if (props?.profile?.TrainerDetails?.bio) {
      setBio(props?.profile?.TrainerDetails?.bio);
    }
  }, [props?.profile?.TrainerDetails?.bio]);

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

  // const progressBar = [1, 2, 3, 4, 5];

  // const calculateRaing = (totalStars = 1, gainStars = 1) => {
  //   if (gainStars === 0 || totalStars === 0) {
  //     if (finalRating !== 5) {
  //       setFinalRating(5);
  //     }
  //   } else {
  //     let Rating = (gainStars / totalStars) * 5;
  //     Rating = parseFloat(Rating.toFixed(1));
  //     if (finalRating !== Rating) {
  //       setFinalRating(Rating);
  //     }
  //   }
  // };

  useEffect(() => {
    //   if (profile?.id) {
    dispatch(getTrainerSpecialities());
    dispatch(getTrainerCertificates());
    dispatch(getTrainerLanguages());
    dispatch(getTrainerCategories());
    //   }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLanguageOption([{ options: [...trainerLanguages], type: "language" }]);
    setCategoriesOption([
      { options: [...trainerCategories], type: "categories" },
    ]);
    if (trainerSpecialities?.length && selectedSpecialities?.length) {
      const arr = [...trainerSpecialities, ...selectedSpecialities];
      const uniqueArr = arr.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.name === item.name)
      );
      setSpecialitiesOption([
        {
          options: uniqueArr,
          type: "specialities",
        },
      ]);
    }

    if (trainerCertificates?.length && selectedCerificates?.length) {
      const arr = [...trainerCertificates, ...selectedCerificates];
      const uniqueArr = arr.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.name === item.name)
      );
      setCertificatesOption([
        {
          options: uniqueArr,
          type: "certificates",
        },
      ]);
    }
  }, [
    trainerLanguages,
    trainerCategories,
    trainerSpecialities,
    trainerCertificates,
    selectedSpecialities,
    selectedCerificates,
  ]);

  useEffect(() => {
    if (languageOption?.length) {
      renderSearchCollapseList(languageOption, 0);
    }
    if (categoriesOption?.length) {
      renderSearchCollapseList(categoriesOption, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetchProfile = () => {
    dispatch(
      getProfileDataAction(props?.profile?.TrainerDetails?.user_id ?? 0)
    );
  };

  const submitAnswers = async (
    successCallback?: (data: any) => void,
    errorCallback?: (error: any) => void
  ) => {
    setIsLoading(true);
    let categories = categoriesOption?.[0]?.options?.length
      ? categoriesOption?.[0]?.options?.filter((x: any) => x.selected)
      : props?.profile?.TrainerDetails?.Categories;

    let categories_id = categories?.map((category: any) => {
      return { category_id: category.id };
    });

    // let specialities = specialitiesOption?.filter((x: any) => x.selected);

    let specialities = specialitiesOption?.[0]?.options?.length
      ? specialitiesOption?.[0]?.options?.filter((x: any) => x.selected)
      : props?.profile?.TrainerDetails?.Specialities;

    let specialities_id = specialities?.map((speciality: any) => {
      return { speciality_id: speciality.id };
    });

    let languages = languageOption?.[0]?.options?.length
      ? languageOption?.[0]?.options?.filter((x: any) => x.selected)
      : props?.profile?.TrainerDetails?.Languages;

    let languages_id = languages?.map((language: any) => {
      return { language_id: language.id };
    });
    let certificates = certificatesOption?.[0]?.options?.length
      ? certificatesOption?.[0]?.options?.filter((x: any) => x.selected)
      : props?.profile?.TrainerDetails?.Certifications;

    let certificates_id = certificates?.map((certificate: any) => {
      return { certification_id: certificate.id };
    });
    const id: number = props.profile?.TrainerDetails?.user_id ?? 0;

    let body = {
      client_id: id,
      ...(categories_id ? { categories: categories_id } : {}),
      ...(specialities_id ? { specialities: specialities_id } : {}),
      ...(languages_id ? { languages: languages_id } : {}),
      ...(certificates_id ? { certifications: certificates_id } : {}),
      bio: bio ? bio : props?.profile?.TrainerDetails?.bio,
      title: title ? title : props?.profile?.TrainerDetails?.title,
      start_year: +moment(
        year ? year : props?.profile?.TrainerDetails?.start_year
      ).format("YYYY"),
    };

    await dispatch(
      postTrainerAddDetailsAction(
        id,
        body,
        (data: any) => {
          successCallback && successCallback(data);
          setIsLoading(false);
          refetchProfile();
          setIsCertificatesModalOpen(false);
          setIsProfessionBioModalOpen(false);
          setIsProfessionDetailModalOpen(false);
          setIsServicesModalOpen(false);
          setIsLanguageModalOpen(false);
          setIsSpecialitiesModalOpen(false);
          toast.success("Request added successfully", { autoClose: 3000 });
        },
        (error: any) => {
          toast(error, { autoClose: 3000 });
          errorCallback && errorCallback(error);
          setIsLoading(false);
        }
      )
    );
    setIsLoading(false);
  };

  const renderTitle = () => {
    return (
      <Row>
        <Col xs="11" sm="11" className="tp-trainer-title">
          <span>{`${props?.profile?.firstname} ${
            props?.profile?.lastname?.charAt(0) + "." || ""
          }`}</span>
          <Image src={VERIFIED} alt="verified" />
        </Col>
        <Col xs="1" sm="1" className="d-flex justify-content-end">
          <Button
            className="no-background no-border full-image-modal-close p-0 m-0"
            onClick={() => setIsProfessionDetailModalOpen(true)}
          >
            <FontAwesomeIcon icon={faEdit} className="ms-2 text-dark" />
          </Button>
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
        {/* <Col className="tp-ratings">
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
        </Col> */}
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
    const bio=props?.profile?.TrainerDetails?.bio?.split('\n')
    return (
      <Row>
        <Col xs="10" sm="11" className="tp-bio">
          {bio?.length ? bio?.map((bio:string,index:number)=>(
            <p key={index}>{bio}</p>
          )):<></>}
        </Col>
        <Col
          xs="2"
          sm="1"
          className="d-flex justify-content-end align-items-center"
        >
          <Button
            className="no-background no-border full-image-modal-close p-0 m-0"
            onClick={() => setIsProfessionBioModalOpen(true)}
          >
            <FontAwesomeIcon icon={faEdit} className="ms-2 text-dark" />
          </Button>
        </Col>
      </Row>
    );
  };
  const renderServices = () => {
    return (
      <Row>
        <Col className="tp-categories">
          <div className="tp-categories-title">
            <Image src={CATEGORIES} alt="categories" />
            <span style={{fontWeight:"bolder"}}> Services:</span>
            <span className="float-end">
              <FontAwesomeIcon
                onClick={() => {
                  setIsServicesModalOpen(true);
                }}
                icon={faEdit}
                className="ms-2"
              />
            </span>
          </div>
          <div className={`${styles.tpCategoryChipsContainer}`}>
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
            <span style={{fontWeight:"bolder"}}> Education/Certificates:</span>
            <span className="float-end">
              <FontAwesomeIcon
                icon={faEdit}
                onClick={() => setIsCertificatesModalOpen(true)}
                className="ms-2"
              />
            </span>
          </div>
          <div className={`${styles.tpCategoryChipsContainer}`}>
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
            <span style={{fontWeight:"bolder"}}> Specialities:</span>
            <span className="float-end">
              <FontAwesomeIcon
                onClick={() => {
                  setIsSpecialitiesModalOpen(true);
                }}
                icon={faEdit}
                className="ms-2"
              />
            </span>
          </div>
          <div className={`${styles.tpCategoryChipsContainer}`}>
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
            <span style={{fontWeight:"bolder"}}> LANGUAGES:</span>
            <span className="float-end">
              <FontAwesomeIcon
                onClick={() => setIsLanguageModalOpen(true)}
                icon={faEdit}
                className="ms-2"
              />
            </span>
          </div>
          <div className={`${styles.tpCategoryChipsContainer}`}>
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
  // const renderRatings = () => {
  //   return (
  //     <Row className="mt-5">
  //       <Col xs="2" className="ratings-container">
  //         <p className="p-0 m-0 font-family-poppins tp-ratting-text">
  //           {finalRating || 5}
  //         </p>
  //         <p className="p-0 m-0 font-family-poppins tp-ratting-out-of">
  //           out of 5
  //         </p>
  //       </Col>
  //       <Col className="d-flex flex-column-reverse">
  //         {progressBar.length &&
  //           progressBar.map((review, index) => {
  //             let addRating = 0;
  //             let DefratingProgress =
  //               reviewsPublished.length &&
  //               reviewsPublished.filter((review: any) => {
  //                 addRating = addRating + review?.rating;
  //                 return review?.rating === index + 1;
  //               }).length;
  //             if (index === 4) {
  //               calculateRaing(reviewsPublished.length * 5, addRating);
  //             }
  //             DefratingProgress =
  //               (DefratingProgress / reviewsPublished.length) * 100;
  //             return (
  //               <Row>
  //                 <Col
  //                   xxl="5"
  //                   xl="5"
  //                   lg="5"
  //                   md="5"
  //                   sm="5"
  //                   xs="6"
  //                   className="d-flex justify-content-end"
  //                 >
  //                   <StarRatings
  //                     rating={index + 1}
  //                     starRatedColor="#06BED8"
  //                     starHoverColor="#06BED8"
  //                     starEmptyColor="#06BED8"
  //                     numberOfStars={index + 1}
  //                     starDimension="20px"
  //                     starSpacing="3px"
  //                     name="rating"
  //                   />
  //                 </Col>
  //                 <Col xxl="7" xl="7" lg="7" md="7" sm="7" xs="6">
  //                   <div className="progress rating-bar">
  //                     <div
  //                       className="progress-bar"
  //                       style={{ width: `${DefratingProgress.toString()}%` }}
  //                       role="progressbar"
  //                       aria-valuenow={80}
  //                       aria-valuemin={0}
  //                       aria-valuemax={100}
  //                     ></div>
  //                   </div>
  //                 </Col>
  //               </Row>
  //             );
  //           })}
  //       </Col>
  //     </Row>
  //   );
  // };

  // const renderReviews = () => {
  //   if (notEmptyReviews?.length) {
  //     return (
  //       <>
  //         <Row className="mt-2">
  //           <Col className="tp-categories">
  //             <div className="tp-categories-title">
  //               <span>Reviews</span>
  //             </div>
  //           </Col>
  //         </Row>
  //         <Row className="border rounded p-2 mt-2">
  //           {notEmptyReviews.length &&
  //             notEmptyReviews.map((review: any) => {
  //               return (
  //                 <Col md={6} xs={12} className="mt-2">
  //                   <div className="background-secondary rounded p-2 d-flex flex-column">
  //                     <div className="client-name-date d-flex justify-content-between">
  //                       <span>
  //                         {review?.user_name
  //                           ? `${review?.user_name.split(" ")[0]} ${
  //                               review?.user_name.split(" ")[1]
  //                                 ? review?.user_name.split(" ")[1].substr(0, 1)
  //                                 : ""
  //                             }`
  //                           : `${review?.userInfo?.firstname} ${
  //                               review?.userInfo?.lastname
  //                                 ? review?.userInfo?.lastname?.charAt(0) + "."
  //                                 : ""
  //                             }`}
  //                       </span>
  //                       <span>
  //                         {moment(review.review_date).format("MMMM YYYY")}
  //                       </span>
  //                     </div>
  //                     <div className="stars mt-2">
  //                       <StarRatings
  //                         rating={review.rating}
  //                         starRatedColor="#06BED8"
  //                         starHoverColor="#06BED8"
  //                         starEmptyColor="#8a8a8a"
  //                         numberOfStars={5}
  //                         starDimension="20px"
  //                         starSpacing="3px"
  //                         name="rating"
  //                       />
  //                     </div>
  //                     <div className="review-text mt-2">{review.note}</div>
  //                   </div>
  //                 </Col>
  //               );
  //             })}
  //         </Row>
  //       </>
  //     );
  //   }
  // };

  const renderBankDetails = () => {
    return (
      <Row>
        <Col xs="12" className="tp-bank-details tp-categories">
          <div className="tp-categories-title">
            <FontAwesomeIcon icon={faUniversity} size="sm" />
            <span style={{fontWeight:"bolder"}}> BANKING DETAILS:</span>
            <span className="float-end">
              <Button
                className="no-background no-border full-image-modal-close p-0 m-0"
                onClick={() => setIsBankDetailModalOpen(true)}
              >
                <FontAwesomeIcon icon={faEdit} className="ms-2 text-dark" />
              </Button>
            </span>
          </div>
        </Col>
        <Button
          variant="primary"
          className="background-primary border-color-primary font-family-poppins text-light mx-2 mt-2 rounded-3"
          style={{ width: "170px",fontSize:"12px" }}
          onClick={() => setIsBankDetailModalOpen(true)}
        >
          ADD BANK DETAILS
        </Button>
      </Row>
    );
  };

  const renderSearchCollapseList = (question: any, indx: number) => {
    // eslint-disable-next-line
    const filteredOptions = (question[0]?.options || []).filter(
      // eslint-disable-next-line
      (option: any) => {
        if (String(option.name).toLowerCase().includes(search)) {
          return option;
        }
      }
    );

    return (
      <div>
        {search === "" ? (
          question[0]?.options?.map((option: any, index: number) => {
            const selected_image =
              option?.checkType === "tick" ? IC_TICK : IC_SELECT;
            return (
              <>
                <div
                  key={index}
                  onClick={() =>
                    handleOptionSelect(
                      indx,
                      option?.id,
                      question?.type,
                      question
                    )
                  }
                  className={`${styles.optionContainer} ${
                    option.selected
                      ? `${styles.optionSelected} background-light`
                      : ""
                  } rounded p-2 my-1`}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {String(option.name).toLowerCase() !== "other" &&
                  option.icon ? (
                    <></>
                  ) : null}
                  {option.name &&
                  String(option.name).toLowerCase() === "other" &&
                  option.othersArrow ? (
                    <input
                      onChange={(text: any) => option.onChangeOther(text)}
                      placeholder="other"
                    />
                  ) : (
                    <span>{option.name}</span>
                  )}
                  {String(option.name).toLowerCase() === "other" &&
                  option.othersArrow ? null : (
                    <Image
                      className={`${styles.optionTick} me-3`}
                      src={option.selected ? selected_image : IC_BOX}
                    />
                  )}
                </div>
              </>
            );
          })
        ) : filteredOptions?.length ? (
          filteredOptions?.map((option: any, index: number) => {
            const selected_image =
              option.checkType === "tick" ? IC_SELECT : IC_TICK;

            return (
              <>
                {/* {handleDefaultSelect(indx, newSpeciality[0]?.id)} */}
                <div
                  key={index}
                  onClick={() =>
                    handleOptionSelect(indx, option?.id, "MCQ", question)
                  }
                  className={`optionContainer ${
                    option.selected ? "optionSelected" : ""
                  }`}
                >
                  {String(option.name).toLowerCase() !== "other" &&
                  option.icon ? (
                    <></>
                  ) : null}
                  {option.name &&
                  String(option.name).toLowerCase() === "other" &&
                  option.othersArrow ? (
                    <input
                      onChange={(text: any) => option.onChangeOther(text)}
                      placeholder="other"
                    />
                  ) : (
                    <span>{option.name}</span>
                  )}
                  {String(option.name).toLowerCase() === "other" &&
                  option.othersArrow ? null : (
                    <Image
                      className={styles.optionTick}
                      src={option.selected ? selected_image : IC_BOX}
                    />
                  )}
                </div>
              </>
            );
          })
        ) : (
          <div className="w-100 d-flex justify-content-end">
            {/* <Button
              className=""
              onClick={() => {
                if (question?.name === "Select specialities") {
                  dispatch(
                    addSpecialityAction({
                      specialties: [
                        {
                          name: search,
                        },
                      ],
                    })
                  );
                } else {
                  dispatch(
                    addCertificatesAction({
                      certifications: [
                        {
                          name: search,
                        },
                      ],
                    })
                  );
                }
              }}
            >
              Add
            </Button> */}
          </div>
        )}
      </div>
    );
  };

  function handleCategories() {
    const array1 = [...trainerCategories];

    const array2 = props?.profile?.TrainerDetails?.Categories?.map(
      (item) => item.Category
    );

    // eslint-disable-next-line
    const data = array1.map((item1) => {
      const item2 =
        array2?.length && array2?.find((item2) => item2.id === item1.id);
      if (item2) {
        item1.selected = true;
        return item1;
      } else {
        return item1;
      }
    });

    setPrevCategoriesCheck(true);
  }
  function handleSpecialities() {
    const array1 = [...trainerSpecialities];
    const array2 = props?.profile?.TrainerDetails?.Specialities?.map(
      (item) => item.Speciality
    );

    array2?.length &&
      array2.map((item: any) => {
        item.selected = true;
        return item;
      });

    setSelectedSpecialities(array2);

    // eslint-disable-next-line
    const data = array1.map((item1) => {
      const item2 =
        array2?.length && array2?.find((item2) => item2.id === item1.id);
      if (item2) {
        item1.selected = true;
      } else {
        item1.selected = false; // Add this line to set selected to false if it is not in array2
      }
      return item1; // Always return the modified object
    });

    setPrevSpecialitiesCheck(true);
  }
  function handleLanguages() {
    const array1 = [...trainerLanguages];

    const array2 = props?.profile?.TrainerDetails?.Languages?.map(
      (item) => item.Language
    );

    // eslint-disable-next-line
    const data = array1.map((item1) => {
      const item2 =
        array2?.length && array2?.find((item2) => item2.id === item1.id);
      if (item2) {
        item1.selected = true;
        return item1;
      } else {
        return item1;
      }
    });

    setPrevLanguagesCheck(true);
  }

  function handleCertifications() {
    const array1 = [...trainerCertificates];

    const array2 = props?.profile?.TrainerDetails?.Certifications?.map(
      (item) => item.Certification
    );

    array2?.length &&
      array2.map((item: any) => {
        item.selected = true;
        return item;
      });

    setSelectedCerificates(array2);
    // eslint-disable-next-line
    const data = array1.map((item1) => {
      const item2 =
        array2?.length && array2?.find((item2) => item2.id === item1.id);
      if (item2) {
        item1.selected = true;
        return item1;
      } else if (item1.selected) {
        return item1;
      } else {
        return item1;
      }
    });

    setPrevCertificatesCheck(true);
  }

  const handleOptionSelect = (
    questionIndex: number,
    id: any,
    type: string,
    question: any
  ) => {
    const temp = question[questionIndex]?.options?.map((x: any) => {
      if (x?.id === id) {
        if (x?.selected) {
          x.selected = false;
          return x;
        } else {
          x.selected = true;
          return x;
        }
      } else {
        return x;
      }
    });

    if (question[0]?.type === "language") {
      setLanguageOption([{ options: [...temp], type: "language" }]);
    } else if (question[0]?.type === "categories") {
      setCategoriesOption([{ options: [...temp], type: "categories" }]);
    } else if (question[0]?.type === "specialities") {
      setSpecialitiesOption([{ options: [...temp], type: "specialities" }]);
    } else if (question[0]?.type === "certificates") {
      setCertificatesOption([{ options: [...temp], type: "certificates" }]);
    }
  };

  if (
    !prevCategoriesCheck &&
    trainerCategories?.length &&
    props?.profile?.TrainerDetails?.Categories
  ) {
    handleCategories();
  }
  if (
    !prevSpecialitiesCheck &&
    trainerSpecialities?.length &&
    props?.profile?.TrainerDetails?.Specialities
  ) {
    handleSpecialities();
  }
  if (
    !prevLanguagesCheck &&
    trainerLanguages?.length &&
    props?.profile?.TrainerDetails?.Languages
  ) {
    handleLanguages();
  }
  if (
    !prevCertificatesCheck &&
    trainerCertificates?.length &&
    props?.profile?.TrainerDetails?.Certifications
  ) {
    handleCertifications();
  }

  const validateBankDetails = () => {
    let hasError = false;
    let _errors: any = {
      selectedCountryLocalError: "",
      accountNumberError: "",
      routingNumberError: "",
      accountHolderNameError: "",
    };
    if (selectedCountryLocal === -1) {
      hasError = true;
      _errors = {
        ..._errors,
        selectedCountryLocalError: "Field cannot be empty",
      };
    }
    if (accountNumber === "") {
      hasError = true;
      _errors = { ..._errors, accountNumberError: "Field cannot be empty" };
    }
    if (routingNumber === "") {
      hasError = true;
      _errors = { ..._errors, routingNumberError: "Field cannot be empty" };
    }
    if (accountHolderName === "") {
      hasError = true;
      _errors = { ..._errors, accountHolderNameError: "Field cannot be empty" };
    }
    setErrors(_errors);
    return hasError;
  };

  const updateUserProfileInStore = useCallback(async (updatedProfile: any) => {
    const userProfileFromLocalStorage = await localStorage.getItem(
      "userProfile"
    );
    if (userProfileFromLocalStorage) {
      const _userProfile = JSON.parse(userProfileFromLocalStorage);
      let _updatedProfile = { ..._userProfile, ...updatedProfile };
      dispatch({ type: SET_USER, payload: _updatedProfile });
      localStorage.setItem("userProfile", JSON.stringify(_updatedProfile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBankDetails = () => {
    if (!validateBankDetails()) {
      const country = countries.filter(
        (item: any) => item?.id == selectedCountryLocal // eslint-disable-line
      );

      setIsLoading(true);
      const updatedProfile = {
        dob: moment(profile?.dob).format("YYYY-MM-DD"),
        phone: profile?.phone,
        franchise: [
          {
            franchise_id: profile?.Franchise[0]?.franchise_id,
            active: profile?.Franchise[0]?.active,
          },
        ],
        bankDataChanged: true,
        country_id: country[0]?.id,
        bankData: {
          country: country[0]?.iso,
          currency: currency,
          account_holder_name: accountHolderName,
          account_holder_type: accountHolderType,
          account_number: accountNumber,
          routing_number: routingNumber,
        },
        status: true,
      };

      dispatch(
        updateUserBankDetailsAction(
          profile?.id,
          updatedProfile,
          (data: any) => {
            updateUserProfileInStore(data);
            toast.success("Bank details added successfully !", {
              autoClose: 3000,
            });
            setIsLoading(false);
            setIsBankDetailModalOpen(false);
            // navigate("/provider-profile");
            return true;
          },
          (error) => {
            setIsLoading(false);
            return false;
          }
        )
      );
      setIsLoading(false);
      return true;
    }
    return false;
  };

  const countryHandler = (text: string) => {
    setSelectedCountryLocal(+text);
    const data = countries.filter((item: any) => item?.id == text); // eslint-disable-line
    setCurrency(data[0]?.currency);
    setErrors({ ...errors, selectedCountryLocalError: "" });
  };
  const accountHolderNameHandler = (text: string) => {
    setAccountHolderName(text);
    setErrors({ ...errors, accountHolderNameError: "" });
  };
  const routingNumberHandler = (text: string) => {
    setRoutingNumber(text);
    setErrors({ ...errors, routingNumberError: "" });
  };
  const accountingNumberHandler = (text: string) => {
    setAccountNumber(text);
    setErrors({ ...errors, accountNumberError: "" });
  };

  return (
    <>
      <Container className="mt-2">
        <Row className="align-items-center pb-3">
          <Col xxl="2" xl="2" lg="2" className="d-flex ">
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
          <Col xxl="10" xl="10" lg="10">
            {renderTitle()}
            {renderStartRating()}
            {renderLocation()}
          </Col>
        </Row>
        <hr className="hr"></hr>
        <Row>
          <Col>
            {renderBio()}
            {renderServices()}
            {renderSpecialities()}
            {renderLanguages()}
            {renderCertificates()}
            {renderBankDetails()}
            {/* {renderRatings()} */}
            {/* {renderReviews()} */}
          </Col>
        </Row>
        {isLoading && (
          <div className="overlay">
            <Spinner animation="grow" variant="info" />
          </div>
        )}
        <FullImageModal
          show={fullImageSource ? true : false}
          image={fullImageSource}
          onHide={() => setFullImageSource(null)}
        />
      </Container>
      <PrimaryModal
        isOpen={isProfessionDetailModalOpen}
        onHide={() => setIsProfessionDetailModalOpen(false)}
        title={"Edit your details"}
      >
        <div className="d-flex justify-content-center m-0 p-0 flex-column">
          <Row>
            <Col className="mb-4">
              <Form.Group className="m-0">
                <p className="w-100 mt-2 mb-0 text-start name-text">
                  WHAT IS YOUR PROFESSION/TITLE?
                </p>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="Type ..."
                />
              </Form.Group>
              <Form.Group className="m-0 mt-3">
                <p className="w-100 mt-2 mb-0 text-start name-text">
                  WHAT YEAR DID YOU START PRACTICING THIS PROFESSION?
                </p>
                {/* <Form.Control
                  as={"input"}
                  type="date"
                  placeholder="Click to enter date"
                  value={year}
                  onChange={(event) => {
                    setYear(event.target.value);
                  }}
                ></Form.Control> */}
                <Form.Select
                  value={year}
                  onChange={(event) => {
                    setYear(event.target.value);
                  }}
                >
                  {!year && (
                    <option value={0} defaultChecked>
                      Select Year
                    </option>
                  )}
                  {year && (
                    <option value={year} defaultChecked>
                      {year}
                    </option>
                  )}
                  {years?.length &&
                    years.map((year: any) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs="10"></Col>
            <Col xs="2">
              <Button
                className="background-primary border-color-primary font-family-poppins text-light w-100 mt-2 rounded-3"
                onClick={() => {
                  submitAnswers();
                }}
              >
                Update
              </Button>
            </Col>
          </Row>
        </div>
      </PrimaryModal>
      <PrimaryModal
        isOpen={isProfessionBioModalOpen}
        onHide={() => setIsProfessionBioModalOpen(false)}
        title={"Edit your details"}
      >
        <div className="d-flex justify-content-center m-0 p-0 flex-column">
          <Row>
            <Col className="mb-4">
              <Form.Group className="m-0 mt-3">
                <p className="w-100 mt-2 mb-0 text-start name-text">
                  Personal Bio?
                </p>
                <Form.Control
                  as={"textarea"}
                  type="text"
                  placeholder={"Type ..."}
                  value={bio}
                  style={{ height: "100px" }}
                  onChange={(event) => setBio(event.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs="10"></Col>
            <Col xs="2">
              <Button
                className="background-primary border-color-primary font-family-poppins text-light w-100 mt-2 rounded-3"
                onClick={() => submitAnswers()}
              >
                Update
              </Button>
            </Col>
          </Row>
        </div>
      </PrimaryModal>

      <PrimaryModal
        isOpen={isBankDetailModalOpen}
        onHide={() => setIsBankDetailModalOpen(false)}
        title={"Add Bank Account Details"}
      >
        <div className="d-flex justify-content-center m-0 p-0 flex-column">
          <Row>
            <Col className="mb-4">
              <Form.Group className="m-0 my-2 ">
                <Form.Label>
                  Connect your bank account to receive instant payments when you
                  are hired
                </Form.Label>
                <Form.Control
                  value={currency}
                  type="text"
                  placeholder="currrency"
                  disabled
                />
                <Form.Text className="text-danger">
                  {errors.currencyError}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                {/* <Form.Label>Country *</Form.Label> */}
                <Form.Select
                  value={selectedCountryLocal}
                  onChange={(event) => {
                    countryHandler(event.target.value);
                  }}
                >
                  <option value={0} defaultChecked>
                    Select Country
                  </option>
                  {countries &&
                    countries?.map((country: CountryModal) => {
                      return (
                        <option value={country.id} key={country.id}>
                          {country.name}
                        </option>
                      );
                    })}
                </Form.Select>
                <Form.Text className="text-danger">
                  {errors.selectedCountryLocalError}
                </Form.Text>
              </Form.Group>
              <Form.Group className="m-0 my-2">
                {/* <Form.Label>Account Holder Name *</Form.Label> */}
                <Form.Control
                  value={accountHolderName}
                  onChange={(e) => accountHolderNameHandler(e.target.value)}
                  type="text"
                  placeholder="Account Holder Name"
                />
                <Form.Text className="text-danger">
                  {errors.accountHolderNameError}
                </Form.Text>
              </Form.Group>
              <Form.Group className="m-0 my-2">
                {/* <Form.Label>Account Holder Type *</Form.Label> */}
                <Form.Control
                  value={accountHolderType}
                  disabled
                  type="text"
                  placeholder="Account Holder Type"
                />
              </Form.Group>
              <Form.Group className="m-0 my-2">
                {/* <Form.Label>Routing Number *</Form.Label> */}
                <Form.Control
                  value={routingNumber}
                  onChange={(e) => routingNumberHandler(e.target.value)}
                  type="text"
                  placeholder="Routing number"
                />
                <Form.Text className="text-danger">
                  {errors.routingNumberError}
                </Form.Text>
              </Form.Group>
              <Form.Group className="m-0 my-2">
                {/* <Form.Label>Account Number *</Form.Label> */}
                <Form.Control
                  value={accountNumber}
                  onChange={(e) => accountingNumberHandler(e.target.value)}
                  type="text"
                  placeholder="Account number"
                />
                <Form.Text className="text-danger">
                  {errors.accountNumberError}
                </Form.Text>
              </Form.Group>
              <small>
                By adding bank account details, you agree to the{" "}
                <span className="color-primary">
                  Stripe Connected Account Agreement
                </span>
              </small>
            </Col>
          </Row>
          <Row>
            <Col xs="10"></Col>
            <Col xs="2">
              <Button
                className="background-primary border-color-primary font-family-poppins text-light w-100 mt-2 rounded-3"
                onClick={() => handleBankDetails()}
              >
                Add
              </Button>
            </Col>
          </Row>
        </div>
      </PrimaryModal>

      <PrimaryModal
        isOpen={isLanguageModalOpen}
        onHide={() => setIsLanguageModalOpen(false)}
        title={"Edit your details"}
      >
        <div className="d-flex justify-content-center m-0 p-0 flex-column">
          <div style={{ flexDirection: "row" }}>
            <p
              className={`
                  ${styles.nameText}
                  w-100
                  mt-2
                  mb-0
                  text-start
                `}
            >
              What languages do you speak?
            </p>
            <p className={`w-100 mt-1 text-start ${styles.descriptionText} `}>
              (Check all that apply)
            </p>
          </div>
          <div style={{ height: "60vh", overflow: "auto" }}>
            {renderSearchCollapseList(languageOption, 0)}
          </div>
          <Row>
            <Col xs="10"></Col>
            <Col xs="2">
              <Button
                className="background-primary border-color-primary font-family-poppins text-light w-100 mt-2 rounded-3"
                onClick={() => {
                  submitAnswers();
                }}
              >
                Update
              </Button>
            </Col>
          </Row>
        </div>
      </PrimaryModal>

      <PrimaryModal
        isOpen={isServicesModalOpen}
        onHide={() => setIsServicesModalOpen(false)}
        title={"Edit your details"}
      >
        <>
          <div className="d-flex justify-content-center m-0 p-0 flex-column">
            <div style={{ flexDirection: "row" }}>
              <p
                className={`
                  ${styles.nameText}
                  w-100
                  mt-2
                  mb-0
                  text-start
                `}
              >
                What services do you provide?
              </p>
              <p className={`w-100 mt-1 text-start ${styles.descriptionText} `}>
                (Check all that apply)
              </p>
            </div>
            <div style={{ height: "40vh", overflow: "auto" }}>
              {renderSearchCollapseList(categoriesOption, 0)}
            </div>
            <Row>
              <Col xs="10"></Col>
              <Col xs="2">
                <Button
                  className="background-primary border-color-primary font-family-poppins text-light w-100 mt-2 rounded-3"
                  onClick={() => {
                    submitAnswers();
                  }}
                >
                  Update
                </Button>
              </Col>
            </Row>
          </div>
        </>
      </PrimaryModal>

      <PrimaryModal
        isOpen={isSpecialitiesModalOpen}
        onHide={() => setIsSpecialitiesModalOpen(false)}
        title={"Edit your details"}
      >
        <div className="d-flex justify-content-center m-0 p-0 flex-column">
          <div style={{ flexDirection: "row" }}>
            <p
              className={`
                  ${styles.nameText}
                  w-100
                  mt-2
                  mb-0
                  text-start
                `}
            >
              What specialities or training program do you have experience in?
            </p>
            <p className={`w-100 mt-1 text-start ${styles.descriptionText} `}>
              (Example: Calculus, Acoustic Guitar, Pre-Post Natal PT)
            </p>
          </div>
          {/* <Form.Group>
            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Add a tag..."
            />
          </Form.Group> */}
          <div style={{ height: "40vh", overflow: "auto" }}>
            {renderSearchCollapseList(specialitiesOption, 0)}
          </div>
          <Row>
            <Col xs="10"></Col>
            <Col xs="2">
              <Button
                className="background-primary border-color-primary font-family-poppins text-light w-100 mt-2 rounded-3"
                onClick={() => {
                  submitAnswers();
                }}
              >
                Update
              </Button>
            </Col>
          </Row>
        </div>
      </PrimaryModal>

      <PrimaryModal
        isOpen={isCertificatesModalOpen}
        onHide={() => setIsCertificatesModalOpen(false)}
        title={"Edit your details"}
      >
        <div className="d-flex justify-content-center m-0 p-0 flex-column">
          <div style={{ flexDirection: "row" }}>
            <p
              className={`
                  ${styles.nameText}
                  w-100
                  mt-2
                  mb-0
                  text-start
                `}
            >
              Add education / certifications that will display on your profile
            </p>
            <p className={`w-100 mt-1 text-start ${styles.descriptionText} `}>
              (Example: Bachelors in English, Masters in Engineering, NASM
              Certified Trainer, CPR)
            </p>
          </div>
          {/* <Form.Group>
            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Type your education..."
            />
          </Form.Group> */}
          <div style={{ height: "60vh", overflow: "auto" }}>
            {renderSearchCollapseList(certificatesOption, 0)}
          </div>
          <Row>
            <Col xs="10"></Col>
            <Col xs="2">
              <Button
                className="background-primary border-color-primary font-family-poppins text-light w-100 mt-2 rounded-3"
                onClick={() => {
                  submitAnswers();
                }}
              >
                Update
              </Button>
            </Col>
          </Row>
        </div>
      </PrimaryModal>
    </>
  );
};

ProviderProfile.propTypes = {
  profile: PropTypes.any,
};

export { ProviderProfile };
