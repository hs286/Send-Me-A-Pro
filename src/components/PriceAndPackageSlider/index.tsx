import React, { useState } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  ListGroup,
  Row,
} from "react-bootstrap";
import Slider from "react-slick";
import {
  AppDispatch,
  PackageCategoryModal,
  PackageModal,
  getCustomPackageAction,
} from "../../redux";
import styles from "./PriceAndPackageSlider.module.css";
import { CheckoutFlowModal, PrimaryModal } from "../";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface PriceAndPackageSliderProps {
  settings: any;
  packageCategories: Array<PackageCategoryModal>;
  cardTitleClass?: any;
  categoryId?: number;
  sectionId?: number;
}

const PriceAndPackageSlider = (props: PriceAndPackageSliderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPackage, setSelectedPackage] = useState<PackageModal>();
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [showPackageListModal, setShowPackageListModal] =
    useState<boolean>(false);
  const [showCustomCodeModal, setShowCustomCodeModal] =
    useState<boolean>(false);
  const [customPackageCode, setCustomPackageCode] = useState<string>("");

  const [selectedPackageCategory, setSelectedPackageCategory] =
    useState<PackageCategoryModal>();

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

  const renderCustomCodeInputModal = () => {
    return (
      <PrimaryModal
        isOpen={showCustomCodeModal}
        centered
        title={"Custom package code"}
        size="sm"
        onHide={() => {
          setShowCustomCodeModal(false);
          setCustomPackageCode("");
        }}
      >
        <>
          <FormGroup>
            <Form.Control
              type="text"
              placeholder="Enter Custom Package Code"
              className="custom-package-code-input"
              value={customPackageCode}
              onChange={(event) => setCustomPackageCode(event.target.value)}
            />
          </FormGroup>
          <Button
            className="w-100 border-color-primary background-primary mt-3"
            onClick={handleFindCustomPackage}
          >
            Find
          </Button>
        </>
      </PrimaryModal>
    );
  };

  const renderPackageListModal = () => {
    return (
      <PrimaryModal
        isOpen={showPackageListModal}
        centered
        title={selectedPackageCategory?.name}
        size="sm"
        onHide={() => {
          setShowPackageListModal(false);
          setTimeout(() => {
            setSelectedPackageCategory(undefined);
          }, 100);
        }}
      >
        <ListGroup as="ul">
          {selectedPackageCategory?.Packages?.map(
            (pkg: PackageModal, index: number) => {
              return (
                <ListGroup.Item
                  as="li"
                  className={styles.package_list_item}
                  key={index}
                >
                  <div className="d-flex flex-column">
                    <span className={styles.package_name}>
                      {pkg.package_name}
                    </span>
                    <span
                      className={`${styles.package_price_per_session} color-primary`}
                    >
                      Price per session {getCurrencySign(pkg)}
                      {pkg.price_amount}
                    </span>
                  </div>
                  <Button
                    className={`background-primary border-color-primary ${styles.purchase_btn}`}
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
      </PrimaryModal>
    );
  };

  const renderPackageCard = (packageCategory: PackageCategoryModal) => {
    return (
      <Card
        className={"pt-2 me-0 ms-0 me-md-2 ms-md-2 " + styles?.package_card}
        key={packageCategory.id}
      >
        <Card.Header className={styles.package_card_header}>
          <Card.Title
            className={"text-center fw-bold " + props?.cardTitleClass}
          >
            {packageCategory?.name}
          </Card.Title>
        </Card.Header>
        <Card.Body className="d-flex flex-column align-items-center">
          <Card.Text className="fw-normal font-14">Starting From</Card.Text>
          <Card.Text className="h1 color-primary">
            {getMinimunPricePerSession(packageCategory.Packages)}
          </Card.Text>
          <Card.Text className="fw-normal font-14">per session</Card.Text>
          <Button
            className="no-background no-border color-primary fw-lighter"
            onClick={() => {
              setSelectedPackageCategory(packageCategory);
              setShowPackageListModal(true);
            }}
          >
            More Details <FontAwesomeIcon icon={faChevronDown} />
          </Button>
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      <Slider
        {...props?.settings}
        infinite={props?.packageCategories?.length > 4}
      >
        {props?.packageCategories?.map((packageCategory, index: number) => {
          return <Col key={index}>{renderPackageCard(packageCategory)}</Col>;
        })}
      </Slider>
      <Row className="mt-4">
        <Col className="justify-content-center d-flex">
          <Button
            className="background-primary border-color-primary btn-sm"
            onClick={() => setShowCustomCodeModal(true)}
          >
            Enter custom package code
          </Button>
        </Col>
      </Row>
      {renderPackageListModal()}
      {renderCustomCodeInputModal()}
      <CheckoutFlowModal
        isOpen={showCheckout}
        title="Checkout"
        onHide={() => {
          setShowCheckout(false);
        }}
        package={selectedPackage}
      />
    </>
  );
};

export { PriceAndPackageSlider };
