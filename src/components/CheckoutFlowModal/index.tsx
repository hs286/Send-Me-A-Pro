import React, { useState } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { PackageSummary } from "../PackageSummary";
import { PackageModal } from "../../redux";
import { SignInComponent } from "../SignInComponent";
import { SignupComponent } from "../SignUpComponent";
import { PrimaryModal } from "../PrimaryModal";

interface CheckoutFlowModalProps {
  isOpen: boolean;
  onHide: any;
  title: string;
  package: PackageModal | undefined;
  onShowForgotPasswordModal?: () => void;
}

const CheckoutFlowModal = (props: CheckoutFlowModalProps) => {
  const [doRegistration, setDoRegistration] = useState<boolean>(false);
  const [showSignInComponent, setShowSignInComponent] = useState<boolean>(true);
  const handleModalTypeChange = (payload: boolean) => {
    setShowSignInComponent(payload);
  };

  const handleCheckoutComplete = async (result: any) => {
    props.onHide();
  };

  return (
    <PrimaryModal
      isOpen={props.isOpen}
      onHide={() => {
        setDoRegistration(false);
        props.onHide();
      }}
      size={doRegistration ? "lg" : "xl"}
      centered={true}
      title={props.title}
      footer={false}
    >
      {doRegistration ? (
        <>
          {showSignInComponent ? (
            <SignInComponent
              toggleMode={handleModalTypeChange}
              onShowForgotPasswordModal={() => {
                if (props.onShowForgotPasswordModal)
                  props.onShowForgotPasswordModal();
              }}
              onSuccess={() => {
                setDoRegistration(false);
              }}
              noSkip={true}
            />
          ) : (
            <SignupComponent
              toggleMode={handleModalTypeChange}
              onSuccess={() => {
                setDoRegistration(false);
              }}
              noSkip={true}
            />
          )}
        </>
      ) : (
        <PackageSummary
          package={props?.package}
          handleCheckoutComplete={handleCheckoutComplete}
          setDoRegistration={setDoRegistration}
          onHide={props.onHide}
        />
      )}
    </PrimaryModal>
  );
};

CheckoutFlowModal.propTypes = {
  isOpen: PropTypes.bool,
  onHide: PropTypes.any,
  package: PropTypes.any,
  title: PropTypes.string,
};

export { CheckoutFlowModal };
