import React, { useState } from "react";
import { Button, Col, Offcanvas, Row } from "react-bootstrap";
import { TrainerProfile } from "../TrainerProfile";
import PropTypes from "prop-types";
import "./style.css";
import { TrainerModal } from "../../redux";
import { useNavigate } from "react-router-dom";
import { useLogicPackage } from "../../hooks";
import { SignInSignUpModal } from "../SignInSignUpModal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ForgotPasswordModal } from "../ForgotPasswordModal";

interface TrainerProfileSidebarProps {
  show: boolean;
  setShow: (flag: boolean) => void;
  trainerProfile: TrainerModal | undefined;
  handleBookNow?: (trainer: TrainerModal) => void;
}

const TrainerProfileSidebar = (props: TrainerProfileSidebarProps) => {
  const navigate = useNavigate();
  const { checkUserHasActivePackage } = useLogicPackage();
  const { profile } = useSelector((state: any) => state.user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] =
    useState<boolean>(false);

  const handleNavigateToMessage = async () => {
    if (!profile?.id) {
      setIsModalOpen(true);
    } else if (await !checkUserHasActivePackage()) {
      toast("You do not have a purchased package please buy a package first");
    } else {
      navigate(
        `/messages/${props.trainerProfile?.id}/${
          props.trainerProfile?.firstname
        }/${props.trainerProfile?.lastname?.charAt(0) + "."}`
      );
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <Offcanvas
        scroll={false}
        show={props?.show}
        id="trainer-profile-sidebar"
        placement="end"
        onHide={() => props?.setShow(false)}
        backdrop={true}
      >
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <TrainerProfile profile={props?.trainerProfile} />
        </Offcanvas.Body>
        <Row className="pe-3">
          <Col sm={6}>
            <Button
              className="background-primary w-100 border-color-primary m-2"
              onClick={() => {
                if (props?.handleBookNow && props.trainerProfile) {
                  props?.handleBookNow(props.trainerProfile);
                }
              }}
            >
              Book Now
            </Button>
          </Col>
          <Col sm={6}>
            <Button
              className="background-primary w-100 border-color-primary m-2"
              onClick={() => handleNavigateToMessage()}
            >
              Message
            </Button>
          </Col>
        </Row>
      </Offcanvas>
      <SignInSignUpModal
        isOpen={isModalOpen}
        onShowForgotPasswordModal={() => {
          setShowForgotPasswordModal(true);
          setIsModalOpen(false);
        }}
        toggleModal={handleModalToggle}
        onSuccess={() => {
          setIsModalOpen(false);
          props?.setShow(false);
        }}
      />
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        toggleModal={() => {
          setShowForgotPasswordModal(!showForgotPasswordModal);
        }}
        onSuccess={() => {
          setShowForgotPasswordModal(false);
          setIsModalOpen(true);
        }}
        onFail={() => {}}
      />
    </div>
  );
};

TrainerProfileSidebar.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func,
  trainerProfile: PropTypes.any,
};

export { TrainerProfileSidebar };
