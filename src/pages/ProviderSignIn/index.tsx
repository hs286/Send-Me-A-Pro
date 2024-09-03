import React, { useState } from "react";
import {
  Button,
  // Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Nav,
  Row,
  Spinner,
} from "react-bootstrap";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { emailRegex, SignInErrorModal } from "./helpers";
import {
  AppDispatch,
  manualSigninAction,
  RoleSignIn,
  CountryModal,
  FranchiseModal,
  userResetPassAction,
  userForgotPassAction,
  // userForgotPassAction,
  // userResetPassAction,
} from "../../redux";
import { useNavigate } from "react-router-dom";
// import {
//   SET_SELECTED_COUNTRY,
//   SET_SELECTED_FRANCHISE,
//   SET_USER,
// } from "../../redux/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faAngleLeft,
  faRegistered,
} from "@fortawesome/free-solid-svg-icons";
import { LOGO } from "../../assets/images";
import { PrimaryModal } from "../../components";

// const clientId =
//   "413867310132-s4e9depk2l56gg6fshlul96nvcqr27da.apps.googleusercontent.com";

const ProviderSignIn = () => {
  // const { countries, franchiseList } = useSelector((state: any) => state.auth);
  // eslint-disable-next-line
  const {}: // selectedCountry,
  // selectedFranchise,
  { selectedCountry: CountryModal; selectedFranchise: FranchiseModal } =
    useSelector((state: any) => state.user);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isForgotPasswordModal, setIsForgotPasswordModal] =
    useState<boolean>(false);
  // const [selectedCountryLocal, setSelectedCountryLocal] = useState<number>();
  // const [selectedFranchiseLocal, setSelectedFranchiseLocal] = useState<
  //     number | undefined
  // >();
  const [errors, setErrors] = useState<SignInErrorModal>({
    emailError: "",
    passwordError: "",
  });
  // const [localFranchiseList, setLocalFranchiseList] = useState<
  //     Array<FranchiseModal>
  // >([]);
  const [step, setStep] = useState(0);
  const [forgotPassEmail, setForgotPassEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetCode, setResetCode] = useState("");

  // useEffect(() => {
  //     if (selectedCountry?.id) {
  //         setSelectedCountryLocal(selectedCountry?.id);
  //     } else {
  //         setSelectedCountryLocal(-1);
  //     }
  //     if (selectedFranchise?.id) {
  //         setSelectedFranchiseLocal(selectedFranchise?.id);
  //     } else {
  //         setSelectedFranchiseLocal(-1);
  //     }
  // }, [selectedCountry, selectedFranchise]);

  // useEffect(() => {
  //     if (countries?.length > 0 && franchiseList?.length > 0) {
  //         setLocalFranchiseList(
  //             franchiseList?.filter(
  //                 (x: FranchiseModal) => x.country_id === selectedCountryLocal
  //             )
  //         );
  //     }
  // }, [countries, franchiseList, selectedCountry, selectedCountryLocal]);

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

  const toggleForgotPasswordModal = () => {
    if (!isLoading) {
      setIsForgotPasswordModal(!isForgotPasswordModal);
      setForgotPassEmail("");
      setNewPassword("");
      setResetCode("");
      setStep(0);
    }
  };

  const handleManualSignIn = () => {
    if (!validate()) {
      setIsLoading(true);
      dispatch(
        manualSigninAction(
          {
            email: email,
            password: password,
            state: RoleSignIn.TR_APP,
          },
          (data: any) => {
            setIsLoading(false);
            navigate(`/`);
            localStorage.setItem("provider", JSON.stringify(data));
          },
          (error) => {
            setIsLoading(false);
          }
        )
      );
    }
  };

  const emailHandler = (text: string) => {
    setEmail(text);
    setErrors({ ...errors, emailError: "" });
  };

  const forgotPassEmailHandler = (text: string) => {
    setForgotPassEmail(text);
    setErrors({ ...errors, forgotPassEmailError: "" });
  };

  const resetCodeHandler = (text: string) => {
    setResetCode(text);
    setErrors({ ...errors, resetCodeError: "" });
  };

  const newPassHandler = (text: string) => {
    setNewPassword(text);
    setErrors({ ...errors, newPassError: "" });
  };

  const passwordHandler = (text: string) => {
    setPassword(text);
    setErrors({ ...errors, passwordError: "" });
  };

  const renderSignInForm = () => {
    return (
      <Row className="justify-content-center">
        <Col xs="12" className="">
          <Form.Group className="mb-3">
            {/* <Form.Label>Email *</Form.Label> */}
            <Form.Control
              onChange={(e) => emailHandler(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
            />
            <Form.Text className="text-danger">{errors.emailError}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            {/* <Form.Label>Password *</Form.Label> */}
            <InputGroup>
              <Form.Control
                onChange={(e) => passwordHandler(e.target.value)}
                value={password}
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
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
      <Row className="justify-content-center pb-4">
        <Col xs="12">
          <p
            onClick={toggleForgotPasswordModal}
            className="text-start forgot-password p-0 mb-2 cursor-pointer text-primary"
          >
            Forgot Password
          </p>
          <div className="w-100 text-center">
            <button
              type="button"
              className="btn background-primary border-color-primary rounded-4 text-light input-label w-50"
              onClick={handleManualSignIn}
            >
              Login
            </button>
          </div>
          <p className="mt-2 already-account text-start">
            Don't have an account?
          </p>
          <div className="w-100 text-center">
            <button
              type="button"
              onClick={() => navigate("/provider-sign-up")}
              className="btn background-light border-color-primary rounded-4 color-primary input-label w-50"
            >
              Sign Up
            </button>
          </div>
        </Col>
      </Row>
    );
  };

  async function submitForgot() {
    setIsLoading(true);
    let error: any = {};

    if (step === 0) {
      if (!email) {
        error.email = true;
      }
      await dispatch(
        userForgotPassAction({ email: forgotPassEmail }, async (data: any) => {
          if ((data = 200)) {
            setStep(1);
            setIsLoading(false);
          }
        })
      );
    }

    if (step === 1) {
      let resetPass = {
        email: forgotPassEmail,
        code: resetCode,
        password: newPassword,
      };
      setErrors({ ...error });
      if (Object.entries(error).length === 0) {
        dispatch(
          userResetPassAction(resetPass, async (data: any) => {
            if ((data = 200)) {
              setIsForgotPasswordModal(!isForgotPasswordModal);
              setForgotPassEmail("");
              setNewPassword("");
              setResetCode("");
              setStep(0);
              setIsLoading(false);
            }
          })
        );
      }
    }
  }

  const resetPassFields = () => {
    return (
      <>
        <Form.Group className="mb-3">
          <Form.Label>Password Reset Code *</Form.Label>
          <Form.Control
            onChange={(e) => resetCodeHandler(e.target.value)}
            value={resetCode}
            type="text"
            placeholder="Enter Reset Code"
          />
          <Form.Text className="text-danger">{errors.emailError}</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>New Password *</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => newPassHandler(e.target.value)}
              value={newPassword}
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
          <Form.Text className="text-danger">{errors.emailError}</Form.Text>
        </Form.Group>
      </>
    );
  };

  const resetPasswordModal = () => {
    return (
      <>
        <PrimaryModal
          isOpen={isForgotPasswordModal}
          onHide={toggleForgotPasswordModal}
          footer={false}
          title="Forgotten Password"
        >
          <>
            <Row className="justify-content-center pt-5 border-bottom">
              <Col
                xxl="7"
                xl="7"
                lg="7"
                md="9"
                sm="12"
                xs="12"
                className="pb-5"
              >
                {step === 1 ? (
                  <p>
                    To reset your password, please check your email inbox for
                    the Password Reset Code that we just sent you and then enter
                    that Code below along with a new password.
                  </p>
                ) : (
                  <p>
                    Don't worry. Just type your e-mail address below and we'll
                    send you further instructions
                  </p>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    onChange={(e) => forgotPassEmailHandler(e.target.value)}
                    value={forgotPassEmail}
                    type="email"
                    placeholder="Type your email"
                  />
                  <Form.Text className="text-danger">
                    {errors.emailError}
                  </Form.Text>
                </Form.Group>
                {step === 1 ? resetPassFields() : null}
                <Button
                  variant="primary"
                  className="background-primary border-color-primary font-family-poppins text-light w-100 mt-3"
                  onClick={submitForgot}
                >
                  Reset Password
                </Button>
              </Col>
            </Row>
            {isLoading && (
              <div className="overlay">
                <Spinner animation="grow" variant="info" />
              </div>
            )}
          </>
        </PrimaryModal>
      </>
    );
  };

  return (
    <div className="image" style={{height:"calc(100vh)"}}>
      <div className="w-100 p-5">
        <Container className="mt-5 card p-0 w-25 w-sm flex-column">
          <Row className="card-header p-0 bg-white border-0 w-100 m-3">
            <Col
              xs="1"
              className="mb-3 p-0 d-flex justify-content-center align-items-center"
            >
              <Nav.Link href={"/"}>
                <FontAwesomeIcon
                  className="color-primary fs-4"
                  role={"button"}
                  icon={faAngleLeft}
                />
              </Nav.Link>
            </Col>
            <Col xs="11" className="mb-3 p-0">
              <Image
                src={LOGO}
                alt="Send me a Trainer"
                className="smat-brand-logo"
                width={"40%"}
              />
              <FontAwesomeIcon
                style={{ fontSize: "12px", position: "absolute", top: "10" }}
                role={"button"}
                icon={faRegistered}
              />
            </Col>
            <div className="loading-bar">
              <div className="short-line"></div>
            </div>
          </Row>
          <Row className="card-body p-0 w-100">
            <Col xs="12" className="">
              <Row>
                <Col xs="12" className="pt-1">
                  <p className="fs-5 text-start fw-bolder">Sign in</p>
                </Col>
              </Row>
              {renderSignInForm()}
              {renderActions()}
            </Col>
          </Row>
          {isLoading && (
            <div className="overlay">
              <Spinner animation="grow" variant="info" />
            </div>
          )}
          {resetPasswordModal()}
        </Container>
      </div>
    </div>
  );
};

export { ProviderSignIn };
