import React, { useState } from "react";
import { PrimaryModal } from "../PrimaryModal";
import { SignInComponent } from "../SignInComponent";
import { SignupComponent } from "../SignUpComponent";
import "./style.css";

interface SignInSignUpModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  onShowForgotPasswordModal: () => void;
  onSuccess: () => void;
}

const SignInSignUpModal = (props: SignInSignUpModalProps) => {
  const [showSignInComponent, setShowSignInComponent] =
    useState<boolean>(false);
  const handleModalTypeChange = (payload: boolean) => {
    setShowSignInComponent(payload);
  };

  return (
    <PrimaryModal
      isOpen={props.isOpen}
      onHide={props.toggleModal}
      footer={false}
      noClose={false}
      headerClassName="no-border"
      title=""
      centered={true}
    >
      {showSignInComponent ? (
        <SignInComponent
          onSuccess={props.onSuccess}
          onShowForgotPasswordModal={props.onShowForgotPasswordModal}
          toggleMode={handleModalTypeChange}
          hideModal={props.toggleModal}
        />
      ) : (
        <SignupComponent
          onSuccess={props.onSuccess}
          toggleMode={handleModalTypeChange}
          hideModal={props.toggleModal}
        />
      )}
    </PrimaryModal>
  );
};

export { SignInSignUpModal };
