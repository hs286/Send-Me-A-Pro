import { Col, Form, Row, Button, Spinner } from "react-bootstrap";
import { PrimaryModal } from "..";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  CountryModal,
  getProfileDataAction,
  updateUserBankDetailsAction,
} from "../../redux";
import moment from "moment";
import { toast } from "react-toastify";
import { SET_USER } from "../../redux/types";

const BankDetailsModal = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
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
  const { countries } = useSelector((state: any) => state.auth);
  const { profile } = useSelector((state: any) => state.user);

  const [accountNumber, setAccountNumber] = React.useState<string>("");
  const [routingNumber, setRoutingNumber] = React.useState<string>("");
  const [accountHolderType] = React.useState<string>("individual");
  const [accountHolderName, setAccountHolderName] = React.useState<string>("");
  const [selectedCountryLocal, setSelectedCountryLocal] =
    React.useState<number>(-1);
  const [currency, setCurrency] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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
            props?.setIsBankDetailModalOpen(false);
            dispatch(getProfileDataAction(profile?.id));
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

  return (
    <PrimaryModal
      isOpen={props?.isOpen}
      onHide={() => props?.setIsBankDetailModalOpen(false)}
      title={"Add Bank Account Details"}
      noClose={false}
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
                placeholder="currency"
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
              Update
            </Button>
          </Col>
        </Row>
        {isLoading && (
          <div className="overlay">
            <Spinner animation="grow" variant="info" />
          </div>
        )}
      </div>
    </PrimaryModal>
  );
};

export { BankDetailsModal };
