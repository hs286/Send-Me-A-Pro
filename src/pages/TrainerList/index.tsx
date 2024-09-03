import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  Form,
  Image,
  Offcanvas,
  Row,
} from "react-bootstrap";
import "./style.css";
import {
  CATEGORIES,
  CERTIFICATE,
  FILTERS,
  LANGUAGE,
  SPECIALITIES,
  VERIFIED,
} from "../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  FilterOptionsModal,
  getTrainersAction,
  TrainerModal,
  setCategoryFilter,
  setSpecialityFilter,
  setCertificateFilter,
  setLanguageFilter,
  FranchiseModal,
  FilterData,
  resetFiltersAction,
  PackageCategoryModal,
  getPackagesByServiceAction,
  setLoaderStateAction,
  getFilterOptionsAction,
  getUserProfileAction,
  LanguageModal,
  CertificateModal,
  SpecialityModal,
  CategoryModal,
  setSpecialitiesInFilterOptionsAction,
  // setBroadcastRequestIsVisibleAction,
} from "../../redux";
import {
  faAngleLeft,
  faAngleRight,
  faClose,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import Badge from "react-bootstrap/Badge";
import {
  ForgotPasswordModal,
  FullImageModal,
  HireTrainerModal,
  PriceAndPackageSlider,
  SignInSignUpModal,
  TrainerProfileSidebar,
} from "../../components";
import {
  SET_SELECTED_COUNTRY,
  SET_SELECTED_FRANCHISE,
} from "../../redux/types";
import { useLogicPackage } from "../../hooks";
import InfiniteScroll from "react-infinite-scroll-component";

const TrainerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { franchise_name } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { checkUserHasActivePackage } = useLogicPackage();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<any[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<any[]>([]);
  const [seeAllCategory, setSeeAllCategory] = useState<boolean>(false);
  const [seeAllSpeciality, setSeeAllSpeciality] = useState<boolean>(false);
  const [seeAllCertificate, setSeeAllCertificate] = useState<boolean>(false);
  const [seeAllLanguage, setSeeAllLanguage] = useState<boolean>(false);
  const [mobileFilters, setMobileFilters] = useState<any[]>([]);
  const [showProfileSidebar, setShowProfileSidebar] = useState<boolean>(false);
  const [selectedTrainerProfile, setSelectedTrainerProfile] =
    useState<TrainerModal>();
  const [fullImageSource, setFullImageSource] = useState<any>(null);
  const [showHireModal, setShowHireModal] = useState<boolean>(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] =
    useState<boolean>(false);
  const [selectedTrainerForHire, setSelectTrainerForHire] = useState<
    TrainerModal | undefined
  >(undefined);

  const { franchiseList } = useSelector((state: any) => state.auth);
  const trainers: Array<TrainerModal> = useSelector(
    (state: any) => state.trainers.list
  );
  const filterOptions: FilterOptionsModal = useSelector(
    (state: any) => state.trainers.filterOptions
  );
  const specialityFilterOptions: Array<SpecialityModal> = useSelector(
    (state: any) => state.trainers.specialityFilterOptions
  );
  const filterData: any = useSelector((state: any) => state.trainers.filters);
  const { currentPage, totalPages } = useSelector(
    (state: any) => state.trainers
  );
  const { selectedFranchise, profile } = useSelector(
    (state: any) => state.user
  );
  const packageCategories: Array<PackageCategoryModal> = useSelector(
    (state: any) => state.package.packageCategoryList
  );

  useEffect(() => {
    getPackagesByService(filterData.categories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFranchise, filterData.categories]);

  useEffect(() => {
    if (filterOptions?.categories?.length > 0) {
      if (searchParams.get("category_id") !== null) {
        const category_id = searchParams.get("category_id");
        let findCat = filterOptions?.categories?.filter(
          (category) =>
            parseInt("" + category.id) === parseInt("" + category_id)
        );
        onSelect(findCat[0], "Categories");
      } else if (trainers.length && searchParams.get("trainer_id") !== null) {
        const trainer_id = searchParams.get("trainer_id");
        let findTr = trainers.filter(
          (trainer) => parseInt("" + trainer.id) === parseInt("" + trainer_id)
        );
        if (trainer_id && !findTr[0]) {
          dispatch(
            getUserProfileAction(+trainer_id, (data) => {
              setSelectedTrainerProfile(data);
            })
          );
        } else {
          setSelectedTrainerProfile(findTr[0]);
        }
        if (profile?.id) {
          setShowProfileSidebar(true);
        } else {
          setIsModalOpen(true);
        }
      } else if (!trainers.length && searchParams.get("trainer_id") !== null) {
        dispatch(
          getTrainersAction(
            { page: 1, franchise_id: selectedFranchise?.id },
            (trainerList) => {
              const trainer_id = searchParams.get("trainer_id");
              let findTr = trainerList.filter(
                (trainer) =>
                  parseInt("" + trainer.id) === parseInt("" + trainer_id)
              );
              if (trainer_id && !findTr[0]) {
                dispatch(
                  getUserProfileAction(+trainer_id, (data) => {
                    setSelectedTrainerProfile(data);
                  })
                );
              } else {
                setSelectedTrainerProfile(findTr[0]);
              }
              if (profile?.id) {
                setShowProfileSidebar(true);
              } else {
                setIsModalOpen(true);
              }
            }
          )
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOptions?.categories?.length]);

  useEffect(() => {
    if (franchiseList.length) {
      if (!franchise_name) {
        dispatch({
          type: SET_SELECTED_FRANCHISE,
          payload: {},
        });
        dispatch(
          getFilterOptionsAction(selectedFranchise?.id, () => {
            if (
              searchParams.get("category_id") === null &&
              searchParams.get("trainer_id") === null
            ) {
              dispatch(getTrainersAction({ page: 1 }));
            }
          })
        );
      } else {
        let name = franchise_name;
        let franchise: FranchiseModal = franchiseList?.find(
          (franchise: FranchiseModal) => franchise.domain === name
        );
        if (franchise) {
          dispatch(
            getFilterOptionsAction(franchise?.id, () => {
              if (
                searchParams.get("category_id") === null &&
                searchParams.get("trainer_id") === null
              ) {
                dispatch(
                  getTrainersAction({ page: 1, franchise_id: franchise?.id })
                );
              }
            })
          );
        }
        dispatch({ type: SET_SELECTED_COUNTRY, payload: franchise?.country });
        dispatch({
          type: SET_SELECTED_FRANCHISE,
          payload: franchise || {},
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchiseList.length]);

  useEffect(() => {
    setSelectedCategory(filterData.categories);
    setSelectedSpeciality(filterData.specialities);
    setSelectedCertificate(filterData.certificates);
    setSelectedLanguage(filterData.languages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData?.categories]);

  const PrevArrow = ({ className, style, onClick }: any) => (
    <Button
      style={{
        ...style,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        position: "absolute",
        borderRadius: 50,
        paddingTop: 1.5,
        zIndex: 1000,
      }}
      onClick={onClick}
      className={className}
    ></Button>
  );

  const NextArrow = ({ className, style, onClick }: any) => (
    <Button
      style={{
        ...style,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 50,
        paddingTop: 1.5,
      }}
      onClick={onClick}
      className={className}
    ></Button>
  );

  const settings = {
    dots: false,
    speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const getPackagesByService = useCallback(
    (service: Array<number>) => {
      if (service?.length > 0 && selectedFranchise?.id) {
        dispatch(setLoaderStateAction(true));
        dispatch(
          getPackagesByServiceAction(
            selectedFranchise.id,
            service[0],
            () => {
              dispatch(setLoaderStateAction(false));
            },
            () => {
              dispatch(setLoaderStateAction(false));
            }
          )
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFranchise]
  );

  const fetchTrainersList = useCallback(
    async (pageNo: number, filters = filterData) => {
      if (franchise_name) {
        let name = franchise_name;
        let selectedFranchise = franchiseList?.find(
          (franchise: FranchiseModal) => franchise.domain === name
        );
        dispatch(
          getTrainersAction({
            franchise_id: selectedFranchise?.id,
            filtersData: filters,
            page: pageNo,
          })
        );
      } else {
        dispatch(
          getTrainersAction({
            franchise_id: selectedFranchise?.id,
            filtersData: filters,
            page: pageNo,
          })
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage, filterData, franchiseList, franchise_name]
  );

  const getTrainers = (filters = filterData, pageNo: number = 1) => {
    fetchTrainersList(pageNo, filters);
  };

  // const showBroadcastRequestModal = () => {
  //   dispatch(setBroadcastRequestIsVisibleAction(true));
  // };

  const findData = (filters: FilterData) => {
    getTrainers(filters, 1);
    let fData = filters;
    let filterList: any[] = [];
    if (
      fData.specialities.length ||
      fData.categories.length ||
      fData.certificates.length ||
      fData.languages.length
    ) {
      let filteredSpecialities: any = filterOptions?.specialities?.filter(
        (e) => fData?.specialities?.findIndex((x: any) => x === e?.id) > -1
      );
      let filteredCategories: any = filterOptions?.categories?.filter(
        (e) => fData?.categories?.findIndex((x: any) => x === e?.id) > -1
      );
      let filteredCertificates: any = filterOptions?.certificates?.filter(
        (e) => fData?.certificates?.findIndex((x: any) => x === e?.id) > -1
      );
      let filteredLanguages: any = filterOptions?.languages?.filter(
        (e) => fData?.languages?.findIndex((x: any) => x === e?.id) > -1
      );
      filterList = [
        ...filteredSpecialities.map((ele: any) => {
          return { ...ele, type: "Specialities" };
        }),
        ...filteredCategories.map((ele: any) => {
          return { ...ele, type: "Categories" };
        }),
        ...filteredCertificates.map((ele: any) => {
          return { ...ele, type: "Certificates" };
        }),
        ...filteredLanguages.map((ele: any) => {
          return { ...ele, type: "Languages" };
        }),
      ];
    }
    setMobileFilters(filterList);
  };

  const onSelect = async (item: any, screenName: any) => {
    let data = [];
    switch (screenName) {
      case "Categories":
        data = categoryFilter(item);
        findData({
          ...filterData,
          categories: data,
        });
        break;
      case "Specialities":
        data = specialitiesFilter(item);
        findData({
          ...filterData,
          specialities: data,
        });
        break;
      case "Certificates":
        data = certificatesFilter(item);
        findData({
          ...filterData,
          certificates: data,
        });
        break;
      case "Languages":
        data = languageFilter(item);
        findData({
          ...filterData,
          languages: data,
        });
        break;
      default:
        break;
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const languageFilter = (item: LanguageModal) => {
    const isInSelected = selectedLanguage.indexOf(item.id);
    if (isInSelected === -1) {
      // if no push into state
      setSelectedLanguage([...selectedLanguage, item.id]);
      dispatch(setLanguageFilter([...selectedLanguage, item.id]));
      return [...selectedLanguage, item.id];
    } else {
      // if yes delete
      const new_selected = selectedLanguage
        .slice(isInSelected + 1)
        .concat(selectedLanguage.slice(0, isInSelected));
      setSelectedLanguage(new_selected);
      dispatch(setLanguageFilter(new_selected));
      return new_selected;
    }
  };

  const certificatesFilter = (item: CertificateModal) => {
    const isInSelected = selectedCertificate.indexOf(item.id);
    if (isInSelected === -1) {
      // if no push into state
      setSelectedCertificate([...selectedCertificate, item.id]);
      dispatch(setCertificateFilter([...selectedCertificate, item.id]));
      return [...selectedCertificate, item.id];
    } else {
      // if yes delete
      const new_selected = selectedCertificate
        .slice(isInSelected + 1)
        .concat(selectedCertificate.slice(0, isInSelected));
      setSelectedCertificate(new_selected);
      dispatch(setCertificateFilter(new_selected));
      return new_selected;
    }
  };

  const specialitiesFilter = (item: SpecialityModal) => {
    const isInSelected = selectedSpeciality.indexOf(item.id);
    if (isInSelected === -1) {
      // if no push into state
      setSelectedSpeciality([...selectedSpeciality, item.id]);
      dispatch(setSpecialityFilter([...selectedSpeciality, item.id]));
      return [...selectedSpeciality, item.id];
    } else {
      // if yes delete
      const new_selected = selectedSpeciality
        .slice(isInSelected + 1)
        .concat(selectedSpeciality.slice(0, isInSelected));
      setSelectedSpeciality(new_selected);
      dispatch(setSpecialityFilter(new_selected));
      return new_selected;
    }
  };

  const categoryFilter = (item: CategoryModal) => {
    const isInSelected = selectedCategory.indexOf(item.id);
    if (isInSelected === -1) {
      // if no push into state
      setSelectedCategory([item.id]);
      if (item.id) {
        setSearchParams({ category_id: item.id + "" });
        dispatch(setCategoryFilter([item.id]));
      }
      if (filterOptions?.categories?.length) {
        const category = filterOptions?.categories?.find(
          (x) => x.id === item.id
        );
        if (category && category.CategorySpecialities?.length) {
          const specialities =
            category.CategorySpecialities?.map((y: any) => y.speciality) || [];
          dispatch(setSpecialitiesInFilterOptionsAction(specialities));
        } else {
          dispatch(setSpecialitiesInFilterOptionsAction([]));
        }
      }
      return [item.id];
    } else {
      // if yes delete
      const new_selected = selectedCategory
        .slice(isInSelected + 1)
        .concat(selectedCategory.slice(0, isInSelected));
      setSelectedCategory(new_selected);
      dispatch(setCategoryFilter(new_selected));
      searchParams.delete("category_id");
      setSearchParams(searchParams);
      dispatch(setSpecialitiesInFilterOptionsAction(specialityFilterOptions));
      return new_selected;
    }
  };

  const getFiltersCount = () => {
    let { categories, certificates, languages, specialities } = filterData;
    let count =
      categories.length +
      certificates.length +
      languages.length +
      specialities.length;
    return count;
  };

  const onClearAllFilters = () => {
    dispatch(resetFiltersAction());
    setSelectedCategory([]);
    setSelectedLanguage([]);
    setSelectedCertificate([]);
    setSelectedSpeciality([]);
    dispatch(setSpecialitiesInFilterOptionsAction(specialityFilterOptions));
    findData({
      categories: [],
      specialities: [],
      languages: [],
      certificates: [],
    });
  };

  const handleBookNow = async (trainer: TrainerModal) => {
    const result = await checkUserHasActivePackage();
    if (result) {
      setSelectTrainerForHire(trainer);
      setShowHireModal(true);
    } else {
      navigate(`/${trainer?.franchise?.domain}/packages`);
    }
  };

  const renderFilterOptions = () => {
    return (
      <>
        <Accordion defaultActiveKey="0" id="trainer-list-filter-accordian">
          <Accordion.Item eventKey="0" id="filter-heading">
            <Accordion.Header>
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div>
                  <Image src={FILTERS} alt="filters" className="filter-icon" />
                  <span className="ms-2">Filters &nbsp;</span>
                  {getFiltersCount() > 0 ? (
                    <Badge pill bg="secondary">
                      {getFiltersCount()}
                    </Badge>
                  ) : null}
                </div>
                {getFiltersCount() > 0 ? (
                  <span
                    className="color-primary"
                    role="button"
                    onClick={onClearAllFilters}
                  >
                    clear
                  </span>
                ) : null}
              </div>
            </Accordion.Header>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <Image src={CATEGORIES} alt="filters" className="filter-icon" />
              <span className="ms-2">Services &nbsp;</span>
              {filterData?.categories?.length ? (
                <Badge pill bg="secondary">
                  {filterData.categories.length}
                </Badge>
              ) : null}
            </Accordion.Header>
            <Accordion.Body className="ps-5">
              <ul className="list-unstyled">
                {filterOptions?.categories?.length > 10 && !seeAllCategory
                  ? filterOptions?.categories?.slice(0, 10).map((category) => (
                      <li key={category.id}>
                        <Form.Check
                          checked={selectedCategory.indexOf(category.id) !== -1}
                          onClick={() => onSelect(category, "Categories")}
                          onChange={() => {}}
                          type="checkbox"
                          label={category.name}
                        />
                      </li>
                    ))
                  : filterOptions?.categories?.map((category) => (
                      <li key={category.id}>
                        <Form.Check
                          checked={selectedCategory.indexOf(category.id) !== -1}
                          onClick={() => onSelect(category, "Categories")}
                          onChange={() => {}}
                          type="checkbox"
                          label={category.name}
                        />
                      </li>
                    ))}
                {filterOptions?.categories?.length > 10 ? (
                  !seeAllCategory ? (
                    <p
                      className="cursor-pointer"
                      onClick={() => setSeeAllCategory(true)}
                    >
                      See More...
                    </p>
                  ) : (
                    <p
                      className="cursor-pointer"
                      onClick={() => setSeeAllCategory(false)}
                    >
                      See Less...
                    </p>
                  )
                ) : null}
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {filterOptions?.specialities?.length ? (
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <Image
                  src={SPECIALITIES}
                  alt="filters"
                  className="filter-icon"
                />
                <span className="ms-2">Specialities &nbsp;</span>
                {filterData?.specialities?.length ? (
                  <Badge pill bg="secondary">
                    {filterData.specialities.length}
                  </Badge>
                ) : null}
              </Accordion.Header>
              <Accordion.Body className="ps-5">
                <ul className="list-unstyled">
                  {filterOptions?.specialities?.length && !seeAllSpeciality
                    ? filterOptions?.specialities
                        ?.slice(0, 10)
                        .map((speciality) => (
                          <li key={speciality.id}>
                            <Form.Check
                              checked={
                                selectedSpeciality.indexOf(speciality.id) !== -1
                              }
                              onClick={() =>
                                onSelect(speciality, "Specialities")
                              }
                              onChange={() => {}}
                              type="checkbox"
                              label={speciality.name}
                            />
                          </li>
                        ))
                    : filterOptions?.specialities?.map((speciality) => (
                        <li key={speciality.id}>
                          <Form.Check
                            checked={
                              selectedSpeciality.indexOf(speciality.id) !== -1
                            }
                            onClick={() => onSelect(speciality, "Specialities")}
                            onChange={() => {}}
                            type="checkbox"
                            label={speciality.name}
                          />
                        </li>
                      ))}
                  {filterOptions?.specialities?.length > 10 ? (
                    !seeAllSpeciality ? (
                      <p
                        className="cursor-pointer"
                        onClick={() => setSeeAllSpeciality(true)}
                      >
                        See More...
                      </p>
                    ) : (
                      <p
                        className="cursor-pointer"
                        onClick={() => setSeeAllSpeciality(false)}
                      >
                        See Less...
                      </p>
                    )
                  ) : null}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ) : null}

          {filterOptions?.certificates?.length ? (
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                <Image
                  src={CERTIFICATE}
                  alt="filters"
                  className="filter-icon"
                />
                <span className="ms-2">Certificates &nbsp;</span>
                {filterData?.certificates?.length ? (
                  <Badge pill bg="secondary">
                    {filterData.certificates.length}
                  </Badge>
                ) : null}
              </Accordion.Header>
              <Accordion.Body className="ps-5">
                <ul className="list-unstyled">
                  {filterOptions?.certificates?.length > 10 &&
                  !seeAllCertificate
                    ? filterOptions?.certificates
                        ?.slice(0, 10)
                        .map((certificate) => (
                          <li key={certificate.id}>
                            <Form.Check
                              checked={
                                selectedCertificate.indexOf(certificate.id) !==
                                -1
                              }
                              onClick={() =>
                                onSelect(certificate, "Certificates")
                              }
                              onChange={() => {}}
                              type="checkbox"
                              label={certificate.name}
                            />
                          </li>
                        ))
                    : filterOptions?.certificates?.map((certificate) => (
                        <li key={certificate.id}>
                          <Form.Check
                            checked={
                              selectedCertificate.indexOf(certificate.id) !== -1
                            }
                            onClick={() =>
                              onSelect(certificate, "Certificates")
                            }
                            onChange={() => {}}
                            type="checkbox"
                            label={certificate.name}
                          />
                        </li>
                      ))}
                  {filterOptions?.certificates?.length > 10 ? (
                    !seeAllCertificate ? (
                      <p
                        className="cursor-pointer"
                        onClick={() => setSeeAllCertificate(true)}
                      >
                        See More...
                      </p>
                    ) : (
                      <p
                        className="cursor-pointer"
                        onClick={() => setSeeAllCertificate(false)}
                      >
                        See Less...
                      </p>
                    )
                  ) : null}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ) : null}

          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <Image src={LANGUAGE} alt="filters" className="filter-icon" />
              <span className="ms-2">Languages &nbsp;</span>
              {filterData?.languages?.length ? (
                <Badge pill bg="secondary">
                  {filterData.languages.length}
                </Badge>
              ) : null}
            </Accordion.Header>
            <Accordion.Body className="ps-5">
              <ul className="list-unstyled">
                {filterOptions?.languages?.length && !seeAllLanguage
                  ? filterOptions?.languages?.slice(0, 10).map((language) => (
                      <li key={language.id}>
                        <Form.Check
                          checked={selectedLanguage.indexOf(language.id) !== -1}
                          onClick={() => onSelect(language, "Languages")}
                          onChange={() => {}}
                          type="checkbox"
                          label={language.name}
                        />
                      </li>
                    ))
                  : filterOptions?.languages?.map((language) => (
                      <li key={language.id}>
                        <Form.Check
                          checked={selectedLanguage.indexOf(language.id) !== -1}
                          onClick={() => onSelect(language, "Languages")}
                          onChange={() => {}}
                          type="checkbox"
                          label={language.name}
                        />
                      </li>
                    ))}
                {filterOptions?.languages?.length > 10 ? (
                  !seeAllLanguage ? (
                    <p
                      className="cursor-pointer"
                      onClick={() => setSeeAllLanguage(true)}
                    >
                      See More...
                    </p>
                  ) : (
                    <p
                      className="cursor-pointer"
                      onClick={() => setSeeAllLanguage(false)}
                    >
                      See Less...
                    </p>
                  )
                ) : null}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </>
    );
  };

  const leftScroll = (idx: number) => {
    const left = document.querySelector(`#categories-carousel-inner-${idx}`);
    if (left) {
      left.scrollBy({
        top: 0,
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const rightScroll = (idx: number) => {
    const right = document.querySelector(`#categories-carousel-inner-${idx}`);
    if (right) {
      right.scrollBy({
        top: 0,
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleNavigateToMessage = async (trainerProfile: any) => {
    if (!profile?.id) {
      setIsModalOpen(true);
    } else if (await !checkUserHasActivePackage()) {
      navigate(`/messages/support`);
      // toast("You do not have a purchased package please buy a package first");
    } else {
      navigate(
        `/messages/${trainerProfile?.id}/${trainerProfile?.firstname}/${
          trainerProfile?.lastname?.charAt(0) + "."
        }`
      );
    }
  };

  const renderMobileFilterOption = () => {
    return (
      <Offcanvas
        scroll={false}
        show={showSidebar}
        id="mobile-filter"
        onHide={() => setShowSidebar(false)}
      >
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>{renderFilterOptions()}</Offcanvas.Body>
      </Offcanvas>
    );
  };

  const onclickReadMore = async (trainer: any) => {
    setSelectedTrainerProfile(trainer);
    if (profile?.id) {
      setShowProfileSidebar(true);
      setSearchParams({ trainer_id: trainer?.id + "" });
    } else {
      setIsModalOpen(true);
    }
  };

  const renderTrainerProfile = (
    trainer: TrainerModal,
    flag: boolean,
    idx: number
  ) => {
    return (
      <Row key={trainer.id} className={flag ? "p-3" : "border-bottom p-3"}>
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
            className="trainer-profile-image no-background no-border"
            onClick={() => {
              onclickReadMore(trainer);
            }}
          >
            <Image
              src={
                trainer.avatar ||
                "https://images.ctfassets.net/psi7gc0m4mjv/6vL20yPWnuuJNvPtnG5KkO/788d1e4e39fccdb3abfed21fd465f2e4/master_personal_trainer_mobile_hero_image_2x.jpg"
              }
              alt="trainer"
              className="trainer-profile-image"
              roundedCircle
            />
          </div>
          <div className="w-100 mt-2">
            <button
              className="package-price-btn btn background-primary text-white w-100"
              onClick={() => handleBookNow(trainer)}
            >
              Book Now
            </button>
            <button
              className="package-price-btn btn background-primary text-white w-100 mt-1"
              onClick={() => handleNavigateToMessage(trainer)}
            >
              Message
            </button>
            {/* <button className="hire-trainer-btn">Hire Trainer</button>
                <button className="chat-btn">
                  <img src={CHAT} alt="chat" />
                  <span>Chat</span>
                </button> */}
          </div>
        </Col>
        <Col
          xxl="9"
          xl="9"
          lg="9"
          md="9"
          sm="12"
          xs="12"
          className="d-flex flex-column justify-content-end mt-3 mt-md-0"
        >
          <Row
            onClick={async () => {
              setSelectedTrainerProfile(trainer);
              if (profile?.id) {
                setShowProfileSidebar(true);
              } else {
                setIsModalOpen(true);
              }
            }}
          >
            <Col xxl={4} xl={4} lg={5} md={5} sm={12} xs={12}>
              <div className="trainer-title">
                <span>{`${trainer.firstname} ${
                  trainer.lastname?.charAt(0)?.toUpperCase() + "." || ""
                }`}</span>
                <Image src={VERIFIED} alt="verified" />
              </div>
              <div className="ratings d-flex align-items-end">
                <StarRatings
                  rating={trainer?.totalRating ? trainer.totalRating : 5}
                  starRatedColor="#06BED8"
                  starHoverColor="#06BED8"
                  starEmptyColor="#8a8a8a"
                  numberOfStars={5}
                  starDimension="20px"
                  starSpacing="3px"
                  name="rating"
                />
                <span className="ms-2 color-secondary">
                  (
                  {trainer?.totalRating
                    ? trainer.totalRating.toFixed(1)
                    : "5.0"}
                  )
                </span>
              </div>
              <div className="profile-location color-secondary mt-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="divor-secondary"
                />
                <span>{`${trainer?.City?.name}, ${trainer?.State?.name}`}</span>
              </div>
            </Col>
            <Col
              xxl={8}
              xl={8}
              lg={7}
              md={7}
              sm={12}
              xs={12}
              className="d-flex align-items-end mt-sm-2 mt-md-0"
            >
              {trainer?.TrainerDetails?.bio ? (
                <div className="bio">
                  <p className="mb-0">
                    <span>{trainer?.TrainerDetails?.bio}</span>
                    {/* <Link to="/profile">read more</Link> */}
                    <Button
                      className="no-background color-primary p-0 no-border read-more-btn"
                      onClick={() => {
                        onclickReadMore(trainer);
                      }}
                    >
                      read more
                    </Button>
                  </p>
                </div>
              ) : null}
            </Col>
          </Row>
          <Row>
            <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
              {trainer?.TrainerDetails?.Categories?.length > 0 ? (
                <div className="categories">
                  <div className="categories-title">
                    <Image src={CATEGORIES} alt="categories" />
                    <span>Categories:</span>
                  </div>
                  <div id="categories-carousel">
                    {trainer?.TrainerDetails?.Categories.length > 3 ? (
                      <button
                        className="arrow-btn"
                        onClick={() => leftScroll(idx)}
                      >
                        <FontAwesomeIcon
                          icon={faAngleLeft}
                          className="divor-secondary"
                        />
                      </button>
                    ) : null}

                    <div
                      id={`categories-carousel-inner-${idx}`}
                      className="category-chips-container"
                    >
                      {trainer?.TrainerDetails?.Categories?.map((item) => {
                        return (
                          <span key={item.id}>{item?.Category?.name}</span>
                        );
                      })}
                    </div>
                    {trainer?.TrainerDetails?.Categories.length > 3 ? (
                      <button
                        className="arrow-btn"
                        onClick={() => rightScroll(idx)}
                      >
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="divor-secondary "
                        />
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <Container className="trainer-list-container min-height-vh-75">
      <TrainerProfileSidebar
        show={showProfileSidebar && selectedTrainerProfile ? true : false}
        setShow={(flag) => {
          setShowProfileSidebar(flag);
          searchParams.delete("trainer_id");
          setSearchParams(searchParams);
        }}
        trainerProfile={selectedTrainerProfile}
        handleBookNow={handleBookNow}
      />
      <Row>
        <Col xxl="3" xl="3" lg="3" className="pt-lg-5">
          <div id="desktop-filter">{renderFilterOptions()}</div>
          {renderMobileFilterOption()}
        </Col>
        <Col xxl="9" xl="9" lg="9" className="filter-section-border pt-3">
          <Row className="mt-2 mb-5">
            <Col className="text-center" xs="12">
              {!selectedFranchise?.id || selectedCategory?.length === 0 ? (
                <span>
                  Please select a location and a service to see prices.
                </span>
              ) : (
                <>
                  {filterOptions?.categories ? (
                    <Row className="mb-2">
                      <Col className="justify-content-center d-flex">
                        <h3>
                          {
                            filterOptions?.categories?.find(
                              (ele) => ele.id === selectedCategory[0]
                            )?.name
                          }
                        </h3>
                      </Col>
                    </Row>
                  ) : null}
                  <PriceAndPackageSlider
                    packageCategories={packageCategories}
                    settings={settings}
                    cardTitleClass={"font-16"}
                  />
                </>
              )}
            </Col>
          </Row>
          <Row className="pb-2">
            {mobileFilters.length ? (
              <>
                <p className="applied-filters-heading pt-2">Applied Filters</p>
                <Col md="10" sm="9" xs="9" className="filter-col pt-1 pb-2">
                  <>
                    {mobileFilters?.map((e: any) => (
                      <span key={e.name} className="filter-chip">
                        {e.name}
                        <FontAwesomeIcon
                          onClick={() => {
                            console.log(e);
                            onSelect(e, e.type);
                          }}
                          color="gray"
                          role={"button"}
                          className="ms-2 margin-end-negative"
                          icon={faClose}
                        />
                      </span>
                    ))}
                  </>
                </Col>
              </>
            ) : null}

            <Col
              md="2"
              sm="3"
              xs="3"
              className="justify-content-end align-items-start filter-bar"
            >
              <button
                className="no-background no-border"
                onClick={() => setShowSidebar(true)}
              >
                <Image src={FILTERS} alt="filters" className="filter-icon" />
                <span className="ms-2">Filters</span>
              </button>
            </Col>
          </Row>
          <InfiniteScroll
            dataLength={trainers?.length || 0}
            next={() => fetchTrainersList(currentPage)}
            hasMore={currentPage <= totalPages}
            loader={<></>}
            endMessage={
              <p className="text-center mt-2">
                <b>Yay! You have seen it all</b>
              </p>
            }
            // below props only if you need pull down functionality
          >
            {trainers?.map((trainer: TrainerModal, index: number) => {
              return renderTrainerProfile(
                trainer,
                index === trainers.length - 1,
                index
              );
            })}
          </InfiniteScroll>
        </Col>
      </Row>
      <SignInSignUpModal
        isOpen={isModalOpen}
        toggleModal={handleModalToggle}
        onShowForgotPasswordModal={() => {
          setIsModalOpen(false);
          setShowForgotPasswordModal(true);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setShowProfileSidebar(true);
        }}
      />
      <FullImageModal
        show={fullImageSource ? true : false}
        image={fullImageSource}
        onHide={() => setFullImageSource(null)}
      />
      <HireTrainerModal
        isOpen={showHireModal}
        onHide={() => {
          setShowHireModal(!showHireModal);
        }}
        trainer={selectedTrainerForHire}
      />
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        toggleModal={() => {
          setShowForgotPasswordModal(!showForgotPasswordModal);
        }}
        onSuccess={() => {
          setShowForgotPasswordModal(false);
          setIsModalOpen(true);
        }}
        onFail={() => {}}
      />
    </Container>
  );
};

export { TrainerList };
