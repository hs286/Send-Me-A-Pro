import React, { useState } from "react";
import { Col, Container, Row, Form, Button, Spinner } from "react-bootstrap";
import {
  AppDispatch,
  changeOldPasswordAction,
  UpdatePasswordModal,
} from "../../redux";
import { useDispatch } from "react-redux";
import "./style.css";

const ChangePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({
    oldPasswordError: "",
    newPasswordError: "",
    confirmPasswordError: "",
  });

  const validate = () => {
    let hasError = false;
    let _errors = {
      oldPasswordError: "",
      newPasswordError: "",
      confirmPasswordError: "",
    };
    if (oldPassword?.length === 0) {
      hasError = true;
      _errors = {
        ..._errors,
        oldPasswordError: "Field cannot be empty",
      };
    } else if (oldPassword?.length < 5) {
      hasError = true;
      _errors = {
        ..._errors,
        oldPasswordError: "Password must contain atlease 5 characters.",
      };
    }
    if (newPassword?.length === 0) {
      hasError = true;
      _errors = {
        ..._errors,
        newPasswordError: "Field cannot be empty",
      };
    } else if (newPassword?.length < 8) {
      hasError = true;
      _errors = {
        ..._errors,
        newPasswordError: "Password must contain atlease 8 characters.",
      };
    }
    if (confirmPassword?.length === 0) {
      hasError = true;
      _errors = {
        ..._errors,
        confirmPasswordError: "Field cannot be empty",
      };
    } else if (confirmPassword?.length < 8) {
      hasError = true;
      _errors = {
        ..._errors,
        confirmPasswordError: "Password must contain atlease 8 characters.",
      };
    } else if (confirmPassword !== newPassword) {
      hasError = true;
      _errors = {
        ..._errors,
        confirmPasswordError: "Password does not match.",
      };
    }
    setErrors(_errors);
    return !hasError;
  };

  const handleSubmit = () => {
    if (validate()) {
      let updatedProfile: UpdatePasswordModal = {
        oldPassword,
        newPassword,
      };
      setIsLoading(true);
      dispatch(
        changeOldPasswordAction(
          updatedProfile,
          () => {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsLoading(false);
          },
          () => {
            setIsLoading(false);
          }
        )
      );
    }
  };

  return (
    <>
      <Container className="min-height-vh-75">
        <Row className="mt-3 justify-content-center">
          <Col className="p-0" lg="5" md="8" sm="10" xs="12">
            <h3 className="p-0 m-0 text-uppercase fw-bolder">
              Change Password
            </h3>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg="5" md="8" sm="10" xs="12">
            <Row className="mt-5">
              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={oldPassword}
                    onChange={(event) => {
                      setOldPassword(event.target.value);
                      setErrors({ ...errors, oldPasswordError: "" });
                    }}
                    placeholder="Old Password"
                  />
                  <Form.Text className="text-muted">
                    {errors?.oldPasswordError}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    placeholder="New Password"
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      setErrors({ ...errors, newPasswordError: "" });
                    }}
                  />
                  <Form.Text className="text-muted">
                    {errors?.newPasswordError}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setErrors({ ...errors, confirmPasswordError: "" });
                    }}
                    placeholder="Confirm New Password"
                  />
                  <Form.Text className="text-muted">
                    {errors?.confirmPasswordError}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs="12">
                <Button
                  onClick={handleSubmit}
                  className="border-color-primary background-primary w-100"
                >
                  {isLoading ? (
                    <Spinner size="sm" animation="border" variant="light" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export { ChangePassword };
