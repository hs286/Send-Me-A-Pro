import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import "./style.css";
import PropTypes from "prop-types";

interface PrimaryModalProps {
  isOpen: boolean;
  onHide: any;
  classNames?: string;
  children: JSX.Element;
  footer: any;
  title?: any;
  centered?: boolean;
  size?: "lg" | "sm" | "xl" | undefined;
  headerClassName?: string;
  noClose?: boolean;
  id?: string;
  fullscreen?: boolean;
}

const PrimaryModal = (props: PrimaryModalProps) => {
  return (
    <div>
      <Modal
        show={props.isOpen}
        onHide={props.onHide}
        className={props.classNames}
        backdrop="static"
        centered={props?.centered}
        size={props?.size || "lg"}
        id={props?.id}
        fullscreen={props.fullscreen || "sm-down"}
      >
        {props?.title ? (
          <ModalHeader
            className={props?.headerClassName}
            closeButton={!props?.noClose}
          >
            {props.title}
          </ModalHeader>
        ) : null}

        <ModalBody>{props.children}</ModalBody>
        {props.footer && <ModalFooter>{props?.footer}</ModalFooter>}
      </Modal>
    </div>
  );
};

PrimaryModal.propTypes = {
  isOpen: PropTypes.bool,
  onHide: PropTypes.any,
  classNames: PropTypes.string,
  children: PropTypes.any,
  footer: PropTypes.any,
  title: PropTypes.string,
  centered: PropTypes.bool,
  size: PropTypes.string,
  headerClassName: PropTypes.string,
};

export { PrimaryModal };
