import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  Card,
  Col,
  Container,
  Row,
  ListGroup,
  Button,
  Form,
} from "react-bootstrap";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  FranchiseModal,
  getCustomPackageAction,
  getPackagesByServiceAction,
  getServiceListAction,
  PackageCategoryModal,
  PackageModal,
  ServiceModal,
  setLoaderStateAction,
} from "../../redux";
import { CheckoutFlowModal, ForgotPasswordModal } from "../../components";
import { useNavigate, useParams } from "react-router-dom";
import { SET_SELECTED_FRANCHISE } from "../../redux/types";
import Slider from "react-slick";
import { toast } from "react-toastify";

const PricingAndPackages = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { franchise_name, service_name } = useParams();
  const services: Array<ServiceModal> = useSelector(
    (state: any) => state.service.list
  );
  const packageCategories: Array<PackageCategoryModal> = useSelector(
    (state: any) => state.package.packageCategoryList
  );
  const { franchiseList } = useSelector((state: any) => state.auth);
  const { selectedFranchise }: { selectedFranchise: FranchiseModal } =
    useSelector((state: any) => state.user);
  const [selectedService, setSelectedService] = useState<ServiceModal | any>();
  const [selectedPackage, setSelectedPackage] = useState<PackageModal>();
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] =
    useState<boolean>(false);
  const [customPackageCode, setCustomPackageCode] = useState<string>("");

  const PrevArrow = ({ className, style, onClick }: any) => (
    <Button
      style={{
        ...style,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        position: "absolute",
        zIndex: 9999,
        borderRadius: 50,
        paddingTop: 1.5,
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
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const getServices = () => {
    if (selectedFranchise?.id) {
      dispatch(
        getServiceListAction(
          selectedFranchise.id,
          (data: Array<ServiceModal>) => {
            if (service_name) {
              let service: ServiceModal | undefined = data.find(
                (x) => x.name === service_name?.replaceAll("-", " ")
              );
              if (!service) {
                return;
              }
              setSelectedService(service);
              navigate(
                `/${
                  selectedFranchise?.domain
                }/packages/${service?.name?.replaceAll(" ", "-")}`
              );
            } else {
              if (data.length > 0) {
                setSelectedService(data[0]);
                navigate(
                  `/${
                    selectedFranchise?.domain
                  }/packages/${data[0]?.name?.replaceAll(" ", "-")}`
                );
              }
            }
          }
        )
      );
    }
  };

  const getPackagesByService = useCallback(
    (service: ServiceModal) => {
      if (service && selectedFranchise?.id) {
        dispatch(setLoaderStateAction(true));
        dispatch(
          getPackagesByServiceAction(
            selectedFranchise.id,
            service.id,
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

  useEffect(() => {
    if (selectedFranchise?.id) {
      getServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFranchise]);

  useEffect(() => {
    let name = franchise_name;
    dispatch({
      type: SET_SELECTED_FRANCHISE,
      payload: franchiseList?.find(
        (franchise: FranchiseModal) => franchise.domain === name
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchiseList]);

  useEffect(() => {
    getPackagesByService(selectedService);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFranchise, selectedService]);

  const getCurrencySign = (pkg: PackageModal) => {
    return pkg?.price_currency_code === "usd"
      ? "$"
      : pkg.price_currency_code === "gb"
      ? "£"
      : "AED";
  };

  const getMinimunPricePerSession = (packages: Array<PackageModal>) => {
    packages.sort((a, b) => a.price_amount - b.price_amount);
    return getCurrencySign(packages[0]) + packages[0]?.price_amount;
  };

  const handleFindCustomPackage = () => {
    if (customPackageCode === "") {
      toast.error("Please enter package code!");
      return;
    }
    dispatch(
      getCustomPackageAction(customPackageCode, (result: PackageModal) => {
        setSelectedPackage(result);
        setShowCheckout(true);
      })
    );
  };

  const renderPackageCard = (packageCategory: PackageCategoryModal) => {
    return (
      <Card
        className="package-card pt-2 me-0 ms-0 me-md-2 ms-md-2"
        key={packageCategory.id}
      >
        <Card.Header className="package-card-header">
          <Card.Title className="text-center fw-bold">
            {packageCategory?.name}
          </Card.Title>
        </Card.Header>
        <Card.Body className="d-flex flex-column align-items-center">
          <Card.Text className="fw-normal h6">Starting From</Card.Text>
          <Card.Text className="h1 color-primary ">
            {getMinimunPricePerSession(packageCategory.Packages)}
          </Card.Text>
          <Card.Text className="fw-normal h6">per session</Card.Text>
          <Accordion defaultActiveKey="0" id="package-accordian">
            <Accordion.Item
              eventKey={packageCategory?.id + ""}
              className="d-flex flex-column align-items-center"
            >
              <Accordion.Header className="color-primary">
                More Details
              </Accordion.Header>
              <Accordion.Body className="w-100">
                <ListGroup as="ul">
                  {packageCategory?.Packages?.map(
                    (pkg: PackageModal, index: number) => {
                      return (
                        <ListGroup.Item
                          as="li"
                          className="package-list-item"
                          key={index}
                        >
                          <div className="d-flex flex-column">
                            <span className="package-name">
                              {pkg.package_name}
                            </span>
                            <span className="package-price-per-session color-primary">
                              Price per session {getCurrencySign(pkg)}
                              {pkg.price_amount}
                            </span>
                          </div>
                          <Button
                            className="background-primary border-color-primary purchase-btn"
                            onClick={() => {
                              setSelectedPackage(pkg);
                              setShowCheckout(true);
                            }}
                          >
                            Purchase
                          </Button>
                        </ListGroup.Item>
                      );
                    }
                  )}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container className="pricing-and-package-container min-height-vh-75">
      <Row className="mt-5">
        <Col lg={3} xs={1} className="extra-gap-col" />
        <Col lg={6} xs={7} className="package-heading-col">
          <h2 className="fs-bold">Packages & Programs</h2>
        </Col>
        <Col lg={3} xs={5} className="d-flex justify-content-end">
          <Button
            className="background-primary border-color-primary rounded-1 contact-btn button"
            onClick={() => navigate(`/${selectedFranchise?.domain}/all`)}
          >
            View All Pros
          </Button>
        </Col>
      </Row>
      <Row className="service-row">
        <Col xl={3} lg={4} xs={12}>
          <Form.Group>
            <Form.Select
              className="custom-package-code-input"
              value={selectedService?.id || -1}
              onChange={(event) => {
                let service: ServiceModal | any = services?.find(
                  (x) => x?.id === +event?.target?.value
                );
                setSelectedService(service);
                navigate(
                  `/${
                    selectedFranchise?.domain
                  }/packages/${service?.name?.replaceAll(" ", "-")}`
                );
                getPackagesByService(service);
              }}
            >
              <option value="-1">Please Select Service</option>
              {services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-5 desktop-package">
        <Slider {...settings} infinite={packageCategories?.length > 4}>
          {packageCategories?.map((packageCategory, index: number) => {
            return <Col key={index}>{renderPackageCard(packageCategory)}</Col>;
          })}
        </Slider>
      </Row>
      <Row className="mobile-package">
        {packageCategories?.map((packageCategory) => {
          return (
            <Col
              xxl={3}
              xl={3}
              lg={4}
              sm={6}
              xs={12}
              className="mt-5"
              key={packageCategory?.id}
            >
              {renderPackageCard(packageCategory)}
            </Col>
          );
        })}
      </Row>
      <Row className="justify-content-center mt-5">
        <Col xl={3} lg={4} md={5} sm={6} xs={12}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Enter Custom Package Code"
              className="custom-package-code-input"
              value={customPackageCode}
              onChange={(event) => setCustomPackageCode(event.target.value)}
            />
          </Form.Group>
          {/* <Button
            className="border-color-primary background-primary custom-package-code-btn ms-2"
            onClick={handleFindCustomPackage}
          >
            Find
          </Button> */}
        </Col>
      </Row>
      <Row className="justify-content-center mt-2">
        <Col xl={3} lg={4} md={5} sm={6} xs={12}>
          <Button
            className="border-color-primary background-primary custom-package-code-btn w-100"
            onClick={handleFindCustomPackage}
          >
            Find
          </Button>
        </Col>
      </Row>

      <CheckoutFlowModal
        isOpen={showCheckout}
        onShowForgotPasswordModal={() => {
          setShowForgotPasswordModal(true);
          setShowCheckout(false);
        }}
        title="Checkout"
        onHide={() => {
          setShowCheckout(false);
        }}
        package={selectedPackage}
      />
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        toggleModal={() => {
          setShowForgotPasswordModal(!showForgotPasswordModal);
        }}
        onSuccess={() => {
          setShowForgotPasswordModal(false);
          setShowCheckout(true);
        }}
        onFail={() => {}}
      />
      {/* <PrimaryModal
        isOpen={showServiceModal}
        onHide={() => {
          services.length > 0 && setSelectedService(services[0]);
          navigate(
            `/${
              selectedFranchise?.domain
            }/packages/${services[0]?.name?.replaceAll(" ", "-")}`
          );
          getPackagesByService(services[0]);
          setShowServiceModal(false);
        }}
        centered
        title="Select Service"
        size="sm"
        footer={false}
      >
        <Stack>
          <Form.Group>
            <Form.Select
              className="custom-package-code-input"
              value={selectedService?.id || -1}
              onChange={(event) =>
                setSelectedService(
                  services?.find((x) => x?.id === +event?.target?.value)
                )
              }
            >
              <option value="-1">Please Select Service</option>
              {services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button
            className="background-primary border-color-primary mt-3"
            onClick={() => {
              if (selectedService) {
                setShowServiceModal(false);
                navigate(
                  `/${
                    selectedFranchise?.domain
                  }/packages/${selectedService?.name?.replaceAll(" ", "-")}`
                );
                getPackagesByService(selectedService);
              }
            }}
          >
            Submit
          </Button>
        </Stack>
      </PrimaryModal> */}
    </Container>
  );
};

export { PricingAndPackages };
