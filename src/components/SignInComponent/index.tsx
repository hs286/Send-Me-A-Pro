import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
// import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import {
  SIGN_IN_WITH_FACEBOOK,
  // SIGN_IN_WITH_GOOGLE,
  SIGN_IN_WITH_APPLE,
} from "../../assets/images";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { emailRegex, mobileRegex, SignInErrorModal } from "./helpers";
import {
  AppDispatch,
  UserModal,
  manualSigninAction,
  RoleSignIn,
  postOauthAction,
  CountryModal,
  FranchiseModal,
  UsetInfoUpdateModal,
  updateGoogleFacebookUserAction,
  setLoaderStateAction,
  appleSignupAction,
} from "../../redux";
import { SET_IS_LOGGED_IN, SET_USER } from "../../redux/types";
import { SkipButton } from "../../components";
import AppleSignin from "react-apple-signin-auth";
import RenderInBrowser from "react-render-in-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-number-input";

// const clientId =
//   "413867310132-s4e9depk2l56gg6fshlul96nvcqr27da.apps.googleusercontent.com";

interface SignInComponentProps {
  onSuccess: () => void;
  onShowForgotPasswordModal: () => void;
  toggleMode?: (data: boolean) => void;
  noSkip?: boolean;
  hideModal?: () => void;
}

const SignInComponent = (props: SignInComponentProps) => {
  const { countries, franchiseList } = useSelector((state: any) => state.auth);
  const {
    selectedCountry,
    selectedFranchise,
  }: { selectedCountry: CountryModal; selectedFranchise: FranchiseModal } =
    useSelector((state: any) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [localUser, setLocalUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectLocationModalOpen, setIsSelectLocationModalOpen] =
    useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [selectedCountryLocal, setSelectedCountryLocal] = useState<number>(-1);
  const [selectedFranchiseLocal, setSelectedFranchiseLocal] = useState<
    number | undefined
  >(-1);
  const [errors, setErrors] = useState<SignInErrorModal>({
    emailError: "",
    passwordError: "",
    phoneError: "",
  });
  const [localFranchiseList, setLocalFranchiseList] = useState<
    Array<FranchiseModal>
  >([]);
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    if (selectedCountry?.id) {
      setSelectedCountryLocal(selectedCountry?.id);
    } else {
      setSelectedCountryLocal(-1);
    }
    if (selectedFranchise?.id) {
      setSelectedFranchiseLocal(selectedFranchise?.id);
    } else {
      setSelectedFranchiseLocal(-1);
    }
  }, [selectedCountry, selectedFranchise]);

  useEffect(() => {
    if (countries?.length > 0 && franchiseList?.length > 0) {
      setLocalFranchiseList(
        franchiseList?.filter(
          (x: FranchiseModal) => x.country_id === selectedCountryLocal
        )
      );
    }
  }, [countries, franchiseList, selectedCountry, selectedCountryLocal]);

  const validate = () => {
    let hasError = false;
    let _errors: SignInErrorModal = {
      emailError: "",
      passwordError: "",
    };
    if (email === "") {
      hasError = true;
      _errors = { ..._errors, emailError: "Field cannot be empty" };
    } else if (!emailRegex.test(email)) {
      hasError = true;
      _errors = { ..._errors, emailError: "Please enter a valid Email" };
    }
    if (password === "") {
      hasError = true;
      _errors = { ..._errors, passwordError: "Field cannot be empty" };
    }
    setErrors(_errors);
    return hasError;
  };

  const handleManualSignIn = () => {
    if (!validate()) {
      dispatch(
        manualSigninAction(
          {
            email: email,
            password: password,
            state: RoleSignIn.CU_APP,
          },
          (data: any) => {
            props.onSuccess();
          }
        )
      );
    }
  };

  const phoneHandler = (text: string) => {
    setPhone(text);
    setErrors({ ...errors, phoneError: "" });
  };

  const countryHandler = (id: number) => {
    setSelectedCountryLocal(id);
    setErrors({ ...errors, countryError: "" });
  };
  const franchiseHandler = (id: number) => {
    setSelectedFranchiseLocal(id);
    setErrors({ ...errors, franchiseError: "" });
  };

  // const handleGoogleSignIn = (event: any) => {
  //   const { accessToken } = event;
  //   if (accessToken) {
  //     dispatch(setLoaderStateAction(true));
  //     dispatch(
  //       postOauthAction(
  //         "google",
  //         {
  //           accessToken,
  //           token: "",
  //         },
  //         async (result: any) => {
  //           const { user, token } = result;
  //           if (user?.Franchise?.length > 0) {
  //             dispatch({ type: SET_USER, payload: user });
  //             dispatch({ type: SET_IS_LOGGED_IN, payload: true });
  //             await localStorage.setItem("userProfile", JSON.stringify(user));
  //             await localStorage.setItem("token", token.token);
  //             dispatch(setLoaderStateAction(false));
  //             props.onSuccess();
  //           } else {
  //             setLocalUser(result);
  //             setIsSelectLocationModalOpen(true);
  //             dispatch(setLoaderStateAction(false));
  //           }
  //         },
  //         () => {
  //           dispatch(setLoaderStateAction(false));
  //         }
  //       )
  //     );
  //   }
  // };

  const emailHandler = (text: string) => {
    setEmail(text);
    setErrors({ ...errors, emailError: "" });
  };

  const passwordHandler = (text: string) => {
    setPassword(text);
    setErrors({ ...errors, passwordError: "" });
  };

  const handleFacebookSignIn = (event: any) => {
    const { accessToken } = event;
    if (accessToken) {
      dispatch(setLoaderStateAction(true));
      dispatch(
        postOauthAction(
          "facebook",
          {
            accessToken,
            token: "",
          },
          async (result: any) => {
            const { user, token } = result;
            if (user?.Franchise?.length > 0) {
              dispatch({ type: SET_USER, payload: user });
              dispatch({ type: SET_IS_LOGGED_IN, payload: true });
              await localStorage.setItem("userProfile", JSON.stringify(user));
              await localStorage.setItem("token", token.token);
              dispatch(setLoaderStateAction(false));
              props.onSuccess();
            } else {
              setLocalUser(result);
              setIsSelectLocationModalOpen(true);
              dispatch(setLoaderStateAction(false));
            }
          },
          () => {
            dispatch(setLoaderStateAction(false));
          }
        )
      );
    }
  };

  const appleResponse = (response: any) => {
    let res = {
      appleAuthRequestResponse: response,
      accessToken: response.authorization.id_token,
    };
    if (!response.error) {
      dispatch(
        appleSignupAction(res, async (data: any) => {
          const { user, token } = data;
          if (user?.Franchise?.length > 0) {
            dispatch({ type: SET_USER, payload: user });
            dispatch({ type: SET_IS_LOGGED_IN, payload: true });
            await localStorage.setItem("userProfile", JSON.stringify(user));
            await localStorage.setItem("token", token.token);
            dispatch(setLoaderStateAction(false));
            props.onSuccess();
          } else {
            setLocalUser(data);
            setIsSelectLocationModalOpen(true);
            dispatch(setLoaderStateAction(false));
          }
        })
      );
    }
  };

  const renderSocialMediaButtons = () => {
    return (
      <Row className="justify-content-center pt-4">
        <Col
          xxl="4"
          xl="4"
          lg="4"
          md="4"
          sm="12"
          className="d-flex justify-content-center"
        >
          <FacebookLogin
            appId="802799357670504"
            fields="name,email,picture"
            scope="public_profile,user_friends,user_actions.books"
            cssClass="social-login-btn"
            callback={(event) => {
              handleFacebookSignIn(event);
            }}
            size="small"
            textButton=""
            icon={
              <Image
                src={SIGN_IN_WITH_FACEBOOK}
                alt="sign in with facebook"
                className="w-100"
              />
            }
          />
        </Col>
        {/* <Col
          xxl="4"
          xl="4"
          lg="4"
          md="4"
          sm="12"
          className="d-flex justify-content-center mt-md-0 mt-sm-2"
        >
          <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={handleGoogleSignIn}
            onFailure={(error) => {
              console.error(error);
            }}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <button
                className="social-login-btn"
                onClick={renderProps?.onClick}
              >
                <Image
                  src={SIGN_IN_WITH_GOOGLE}
                  alt="sign in with google"
                  className="w-100"
                />
              </button>
            )}
          />
        </Col> */}
        <RenderInBrowser safari mobile only>
          <Col
            xxl="4"
            xl="4"
            lg="4"
            md="4"
            sm="12"
            className="d-flex justify-content-center mt-md-0 mt-sm-2"
          >
            <AppleSignin
              /** Auth options passed to AppleID.auth.init() */
              authOptions={{
                /** Client ID - eg: 'com.example.com' */
                clientId: "com.sendmeatrainer.webapp",
                /** Requested scopes, seperated by spaces - eg: 'email name' */
                scope: "email name",
                /** Apple's redirectURI - must be one of the URIs you added to the serviceID - the undocumented trick in apple docs is that you should call auth from a page that is listed as a redirectURI, localhost fails */
                redirectURI: "https://dev-webapp.sendmeatrainer.com",
                /** State string that is returned with the apple response */
                state: "state",
                /** Nonce */
                nonce: "nonce",
                /** Uses popup auth instead of redirection */
                usePopup: true,
              }} // REQUIRED
              /** General props */
              uiType="dark"
              /** className */
              className="apple-auth-btn"
              /** Removes default style tag */
              noDefaultStyle={false}
              /** Allows to change the button's children, eg: for changing the button text */
              buttonExtraChildren="Continue with Apple"
              /** Extra controlling props */
              /** Called upon signin success in case authOptions.usePopup = true -- which means auth is handled client side */
              onSuccess={(response: any) => appleResponse(response)} // default = undefined
              /** Called upon signin error */
              onError={(error: any) => console.error(error)} // default = undefined
              /** Skips loading the apple script if true */
              skipScript={false} // default = undefined
              /** Apple image props */
              iconProp={{ style: { marginTop: "10px" } }} // default = undefined
              /** render function - called with all props - can be used to fully customize the UI by rendering your own component  */
              render={(props: any) => (
                <button
                  {...props}
                  className="social-login-btn"
                  onClick={props.onClick}
                >
                  <Image
                    src={SIGN_IN_WITH_APPLE}
                    alt="sign in with apple"
                    className="w-100"
                  />
                </button>
              )}
            />
          </Col>
        </RenderInBrowser>
      </Row>
    );
  };

  const renderSignInForm = () => {
    return (
      <Row className="justify-content-center pt-5 border-bottom">
        <Col xxl="7" xl="7" lg="7" md="9" sm="12" xs="12" className="pb-5">
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              onChange={(e) => emailHandler(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter Email"
            />
            <Form.Text className="text-danger">{errors.emailError}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password *</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={(e) => passwordHandler(e.target.value)}
                value={password}
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter Password"
              />
              <InputGroup.Text id="basic-addon2">
                <FontAwesomeIcon
                  onClick={() => {
                    setIsPasswordVisible(!isPasswordVisible);
                  }}
                  role={"button"}
                  icon={isPasswordVisible ? faEye : faEyeSlash}
                />
              </InputGroup.Text>
            </InputGroup>
            <Form.Text className="text-danger">
              {errors.passwordError}
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
    );
  };

  const renderActions = () => {
    return (
      <Row className="justify-content-center pt-4 pb-4">
        <Col xxl="5" xl="5" lg="5" md="6" sm="12" xs="12">
          <button
            type="button"
            className="btn background-primary border-color-primary text-light input-label w-100"
            onClick={handleManualSignIn}
          >
            Login
          </button>
          <p
            onClick={props.onShowForgotPasswordModal}
            className="text-center p-0 m-0 cursor-pointer"
          >
            Forgot Password
          </p>
          <p className="mt-2 already-account text-center">
            Don't have an account? Sign Up please
          </p>
          <button
            type="button"
            onClick={() => props.toggleMode && props.toggleMode(false)}
            className="btn background-primary border-color-primary text-light input-label w-100"
          >
            Sign Up
          </button>
        </Col>
      </Row>
    );
  };

  const validateLocationModal = () => {
    let hasError = false;
    let _errors: SignInErrorModal = {
      emailError: "",
      passwordError: "",
      countryError: "",
      franchiseError: "",
      phoneError: "",
    };
    if (phone === "") {
      hasError = true;
      _errors = { ..._errors, phoneError: "Field cannot be empty" };
    } else if (phone?.length < 10) {
      hasError = true;
      _errors = { ..._errors, phoneError: "Please enter a valid Phone number" };
    } else if (!mobileRegex.test(phone)) {
      hasError = true;
      _errors = { ..._errors, phoneError: "Please enter a valid Phone number" };
    }
    if (selectedCountryLocal === -1 || !selectedCountryLocal) {
      hasError = true;
      _errors = { ..._errors, countryError: "Please select a country" };
    }
    if (selectedFranchiseLocal === -1 || !selectedFranchiseLocal) {
      hasError = true;
      _errors = { ..._errors, franchiseError: "Please select a franchise" };
    }
    setErrors(_errors);
    return hasError;
  };

  const handleLocationSave = () => {
    if (!validateLocationModal()) {
      const { token, user } = localUser;
      const seletedFranchiseObj: FranchiseModal = franchiseList.find(
        (franchise: FranchiseModal) => franchise.id === selectedFranchiseLocal
      );
      const selectedCountryObj: CountryModal = countries.find(
        (contry: CountryModal) => contry.id === selectedCountryLocal
      );
      saveLocation(user, token, selectedCountryObj, seletedFranchiseObj);
    }
  };

  const saveLocation = (
    user: any,
    token: any,
    selectedCountryObj: any,
    seletedFranchiseObj: any
  ) => {
    let userInfoToSend: UsetInfoUpdateModal = {
      city_id: user.city_id,
      country_id: selectedCountryObj?.id || user?.country_id,
      email: user?.email || null,
      franchise: [{ franchise_id: seletedFranchiseObj?.id, active: true }],
      firstname: user?.firstname || null,
      lastname: user?.lastname || null,
      state_id: user?.state_id,
      zipcode: "",
      gender: "",
      dob: "",
      avatar: user?.avatar || null,
      role: "CU",
      status: true,
      card_data_changed: false,
      bank_data_changed: false,
      individual_data_changed: false,
      phone: phone,
    };
    setIsLoading(true);
    dispatch(
      updateGoogleFacebookUserAction(
        user?.id,
        userInfoToSend,
        async (userData: UserModal) => {
          dispatch({ type: SET_USER, payload: userData });
          dispatch({ type: SET_IS_LOGGED_IN, payload: true });
          await localStorage.setItem("userProfile", JSON.stringify(userData));
          await localStorage.setItem("token", token.token);
          props.onSuccess();
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        },
        { Authorization: `Bearer ${token.token}` }
      )
    );
  };

  const onSuccessSkip = (response: any) => {
    setLocalUser(response);
    if (selectedCountry?.id && selectedFranchise?.id) {
      let { user, token } = response;
      saveLocation(user, token, selectedCountry, selectedFranchise);
    } else {
      setIsSelectLocationModalOpen(true);
    }
  };

  return (
    <Container fluid>
      {isSelectLocationModalOpen ? (
        <>
          <Row className="justify-content-center pt-5 border-bottom">
            <Col
              xxl="12"
              xl="12"
              lg="12"
              md="12"
              sm="12"
              xs="12"
              className="pb-5"
            >
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <PhoneInput
                  countries={["US", "AE", "GB"]}
                  addInternationalOption={false}
                  defaultCountry="US"
                  placeholder="Enter Phone Number"
                  limitMaxLength={true}
                  value={phone}
                  onChange={(number: string) => {
                    phoneHandler(number);
                  }}
                />
                <Form.Text className="text-danger">
                  {errors.phoneError}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Select
                  value={selectedCountryLocal}
                  onChange={(event) => {
                    countryHandler(+event.target.value);
                  }}
                >
                  <option value={-1} selected disabled>
                    Please select Country
                  </option>
                  {countries.map((country: CountryModal) => {
                    return (
                      <option value={country.id} key={country.id}>
                        {country.name}
                      </option>
                    );
                  })}
                </Form.Select>
                <Form.Text className="text-danger">
                  {errors.countryError}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Select
                  value={selectedFranchiseLocal}
                  onChange={(event) => {
                    franchiseHandler(+event.target.value);
                  }}
                >
                  <option value={-1} selected disabled>
                    Please select Location
                  </option>
                  {localFranchiseList.map((franchise: FranchiseModal) => {
                    return (
                      <option value={franchise.id} key={franchise.id}>
                        {franchise.name}
                      </option>
                    );
                  })}
                </Form.Select>
                <Form.Text className="text-danger">
                  {errors.franchiseError}
                </Form.Text>
              </Form.Group>
              <Button
                variant="primary"
                className="background-primary border-color-primary font-family-poppins text-light w-100 mt-3"
                onClick={handleLocationSave}
              >
                Save
              </Button>
            </Col>
          </Row>
          {isLoading && (
            <div className="overlay">
              <Spinner animation="grow" variant="info" />
            </div>
          )}
        </>
      ) : (
        <Row className="justify-content-center">
          <Col xxl="12">
            <Row className="border-bottom">
              <Col className="position-relative pb-3" xs="12">
                <FontAwesomeIcon
                  onClick={props.hideModal}
                  role={"button"}
                  className="ms-1"
                  size="1x"
                  icon={faXmark}
                />
                <p className="fs-5 text-sm-center p-0 m-0 fw-bolder">Login</p>
                {!props?.noSkip ? (
                  <div className="position-absolute top-0 end-0">
                    <SkipButton onSuccessSkip={onSuccessSkip} />
                  </div>
                ) : null}
              </Col>
            </Row>
            {renderSocialMediaButtons()}
            {renderSignInForm()}
            {renderActions()}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export { SignInComponent };
