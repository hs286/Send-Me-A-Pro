import React from "react";
import { Image, Button } from "react-bootstrap";
import "./style.css";
import proptypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PrimaryModal } from "../PrimaryModal";

interface FullImageModalProps {
  image: any;
  show: boolean;
  onHide: () => void;
}

const FullImageModal = (props: FullImageModalProps) => {
  return (
    <PrimaryModal
      isOpen={props?.show}
      onHide={() => props?.onHide()}
      id="full-image-modal"
      centered={true}
      footer={false}
    >
      <div className="d-flex justify-content-center align-items-start">
        <Image src={props?.image} className="full-image" />
        <Button
          className="no-background no-border full-image-modal-close"
          onClick={() => props?.onHide()}
        >
          <FontAwesomeIcon icon={faXmark} className="text-white h1" />
        </Button>
      </div>
    </PrimaryModal>
  );
};

FullImageModal.propTypes = {
  image: proptypes.any,
  show: proptypes.bool,
};

export { FullImageModal };
