import React, { useEffect, useState } from "react";
import { PrimaryModal } from "../PrimaryModal";
import proptypes from "prop-types";
import { Button, Col, Form, Row } from "react-bootstrap";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
} from "react-google-places-autocomplete";
import { CategoryModal, PackageTypeModal, TrainerModal } from "../../redux";
import { useLogicHire, useLogicPackage } from "../../hooks";
import { useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./style.css";
interface HireTrainerProps {
  trainer: TrainerModal | undefined;
  isOpen: boolean;
  onHide: () => void;
}
interface ErrorModal {
  locationError: string;
  serviceError: string;
  packageError: string;
}

const HireTrainerModal = (props: HireTrainerProps) => {
  const navigate = useNavigate();
  const { profile } = useSelector((state: any) => state.user);
  const { getUserActiveCategories, getActivePackageType } = useLogicPackage();
  const [categories, setCategories] = useState<Array<CategoryModal>>([]);
  const [packageTypes, setPackageTypes] = useState<Array<PackageTypeModal>>([]);
  const [coordinates, setCoordinates] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("-1");
  const [selectedPackage, setSelectedpackage] = useState<string>("-1");
  const [location, setLocation] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<any>(
    moment().format(
      profile?.Country?.iso === "US" ? "MM/DD/YYYY" : "DD/MM/YYYY"
    )
  );
  const [selectedTime, setSelectedTime] = useState<any>(
    moment().format(profile?.Country?.iso === "GB" ? "HH:MM" : "hh:mm A")
  );
  const [errors, setErrors] = useState<ErrorModal>({
    locationError: "",
    serviceError: "",
    packageError: "",
  });

  const { submitForm } = useLogicHire({
    beginTraining: selectedDate,
    sessionTime: selectedTime,
    coordinate: coordinates,
    location: location,
    selectedService: +selectedService,
    selectedPackageType: +selectedPackage,
    message: message,
    trainer_id: props.trainer?.id || 0,
  });

  useEffect(() => {
    if (props?.isOpen) {
      setCategories(getUserActiveCategories());
      setPackageTypes(getActivePackageType());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.isOpen]);

  const onChangeLocation = (evt: any) => {
    geocodeByPlaceId(evt?.value?.place_id)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setCoordinates(`${lat},${lng}`);
        setLocation(evt.label);
        setErrors({ ...errors, locationError: "" });
      });
  };

  const validate = () => {
    let hasError = false;
    let localErrors: ErrorModal = {
      locationError: "",
      serviceError: "",
      packageError: "",
    };
    if (selectedService === "-1") {
      hasError = true;
      localErrors = { ...localErrors, serviceError: "Please select service!" };
    } else {
      hasError = false;
      localErrors = { ...localErrors, serviceError: "" };
    }
    if (selectedService === "-1") {
      hasError = true;
      localErrors = {
        ...localErrors,
        packageError: "Please select a package type!",
      };
    } else {
      hasError = false;
      localErrors = { ...localErrors, packageError: "" };
    }
    if (location === "") {
      hasError = true;
      localErrors = {
        ...localErrors,
        locationError: "Please select a location!",
      };
    } else {
      hasError = false;
      localErrors = { ...localErrors, locationError: "" };
    }
    setErrors(localErrors);
    return hasError;
  };

  const onSuccessHire = () => {
    toast("Hired trainer successfully !");
    props.onHide();
    navigate(
      `/messages/${props.trainer?.id}/${props.trainer?.firstname}/${
        props.trainer?.lastname?.charAt(0) + "."
      }`
    );
  };

  const onSubmitForm = () => {
    if (!validate()) {
      submitForm(onSuccessHire);
    }
  };

  const onCancelForm = () => {
    setCoordinates("");
    setLocation("");
    setSelectedService("-1");
    setSelectedpackage("-1");
    setSelectedDate(
      moment().format(
        profile?.Country?.iso === "US" ? "MM/DD/YYYY" : "DD/MM/YYYY"
      )
    );
    setSelectedTime(
      moment().format(profile?.Country?.iso === "GB" ? "HH:MM" : "hh:mm A")
    );

    props?.onHide();
  };

  const renderFooter = () => {
    return (
      <>
        <Button
          className="background-secondary no-border text-black"
          onClick={onCancelForm}
        >
          Cancel
        </Button>
        <Button onClick={onSubmitForm} className="background-primary no-border">
          Submit
        </Button>
      </>
    );
  };
  return (
    <PrimaryModal
      isOpen={props?.isOpen}
      centered={true}
      onHide={onCancelForm}
      footer={renderFooter()}
      title={
        "Hire " +
        props.trainer?.firstname +
        " " +
        props?.trainer?.lastname?.charAt(0) +
        "."
      }
    >
      <Row>
        <Col xs="12">
          <Form.Group className="mb-3">
            <Form.Label>Choose Location</Form.Label>
            <GooglePlacesAutocomplete
              apiKey="AIzaSyC-uV3wsG3ALfeYMCU_i_RvlNs8pgHpj5E"
              selectProps={{
                location,
                onChange: (place: any) => {
                  onChangeLocation(place);
                },
              }}
            />
            <Form.Text className="text-danger">
              {errors.locationError}
            </Form.Text>
          </Form.Group>
        </Col>
        <Col xs="12" sm="6">
          <Form.Group className="mb-3">
            <Form.Label>Service</Form.Label>
            <Form.Select
              value={selectedService}
              onChange={(event) => {
                setErrors({ ...errors, serviceError: "" });
                setSelectedService(event.target.value);
              }}
            >
              <option selected disabled value="-1">
                Please select
              </option>
              {categories.map((catergory: CategoryModal) => {
                return (
                  <option key={catergory.id} value={catergory.id}>
                    {catergory.name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Text className="text-danger">{errors.serviceError}</Form.Text>
          </Form.Group>
        </Col>
        <Col xs="12" sm="6">
          <Form.Group className="mb-3">
            <Form.Label>Session Length </Form.Label>
            <Form.Select
              value={selectedPackage}
              onChange={(event) => {
                setErrors({ ...errors, packageError: "" });
                setSelectedpackage(event.target.value);
              }}
            >
              <option selected disabled value="-1">
                Please select
              </option>
              {packageTypes.map((packageType: PackageTypeModal) => {
                return (
                  <option key={packageType.id} value={packageType.id}>
                    {packageType.name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Text className="text-danger">{errors.packageError}</Form.Text>
          </Form.Group>
        </Col>
        <Col xs="12" sm="6">
          <Form.Group className="mb-3">
            <Form.Label>Session Date </Form.Label>
            <Form.Control
              as={"input"}
              type="date"
              value={moment(selectedDate).format("YYYY-MM-DD")}
              onChange={(event) => {
                setSelectedDate(
                  moment(event.target.value).format(
                    profile?.Country?.iso === "US" ? "MM/DD/YYYY" : "DD/MM/YYYY"
                  )
                );
              }}
            ></Form.Control>
          </Form.Group>
        </Col>
        <Col xs="12" sm="6">
          <Form.Group className="mb-3">
            <Form.Label>Session Time</Form.Label>
            <Form.Control
              as={"input"}
              type="time"
              value={moment(selectedTime, "HH:mm:ss").format("HH:mm")}
              onChange={(event) => {
                setSelectedTime(event.target.value);
              }}
              placeholder="time"
            />
          </Form.Group>
        </Col>
        <Col xs="12">
          <Form.Group className="mb-3">
            <Form.Label>Additional Info </Form.Label>
            <Form.Control
              value={message}
              as="textarea"
              onChange={(event) => {
                setMessage(event.target.value);
              }}
            />
          </Form.Group>
        </Col>
      </Row>
    </PrimaryModal>
  );
};

HireTrainerModal.propTypes = {
  isOpen: proptypes.bool,
  onHide: proptypes.func,
};

export { HireTrainerModal };
