import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  AppDispatch,
  userForgotPassAction,
  userResetPassAction,
} from "../../redux";
import { PrimaryModal } from "../PrimaryModal";
import "./style.css";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  onSuccess: () => void;
  onFail: () => void;
}

const ForgotPasswordModal = (props: ForgotPasswordModalProps) => {
  const { onSuccess, onFail } = props;
  const [step, setStep] = useState<number>(0);
  const [email, setForgotPassEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [resetCode, setResetCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [errors, setErrors] = useState<any>({});

  const dispatch = useDispatch<AppDispatch>();
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

  async function submitForgot() {
    setIsLoading(true);
    let error: any = {};

    if (step === 0) {
      if (!email) {
        error.email = true;
      }
      await dispatch(
        userForgotPassAction({ email: email }, async (data: any) => {
          if ((data = 200)) {
            setStep(1);
            setIsLoading(false);
          }
        })
      );
    }

    if (step === 1) {
      let resetPass = {
        email: email,
        code: resetCode,
        password: newPassword,
      };
      setErrors({ ...error });
      if (Object.entries(error).length === 0) {
        dispatch(
          userResetPassAction(
            resetPass,
            async (data: any) => {
              if ((data = 200)) {
                setForgotPassEmail("");
                setNewPassword("");
                setResetCode("");
                setStep(0);
                setIsLoading(false);
                onSuccess();
              }
            },
            () => {
              setIsLoading(false);
              onFail();
            }
          )
        );
      }
    }
  }

  return (
    <PrimaryModal
      isOpen={props.isOpen}
      onHide={() => {
        setStep(0);
        setForgotPassEmail("");
        setResetCode("");
        setNewPassword("");
        props.toggleModal();
      }}
      noClose={false}
      footer={false}
      headerClassName="no-border"
      title="Forgot Password"
      centered={true}
    >
      <>
        <Row className="justify-content-center pt-5 border-bottom">
          <Col xxl="7" xl="7" lg="7" md="9" sm="12" xs="12" className="pb-5">
            {step === 1 ? (
              <p>
                To reset your password, please check your email inbox for the
                Password Reset Code that we just sent you and then enter that
                Code below along with a new password.
              </p>
            ) : (
              <p>
                Don't worry. Just type your e-mail address below and we'll send
                you further instructions
              </p>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                onChange={(e) => forgotPassEmailHandler(e.target.value)}
                value={email}
                type="email"
                placeholder="Type your email"
              />
              <Form.Text className="text-danger">{errors.emailError}</Form.Text>
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
  );
};

export { ForgotPasswordModal };
