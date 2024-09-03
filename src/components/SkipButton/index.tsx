import React from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";
import { useDispatch } from "react-redux";
import { AppDispatch, guestUpAction } from "../../redux";

interface SkipButtonProps {
  onSuccessSkip: (response: any) => void;
}

const SkipButton = (props: SkipButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleSkipClick = () => {
    dispatch(
      guestUpAction(
        {
          role: "CU",
        },
        (_response: any) => {
          props.onSuccessSkip(_response);
        }
      )
    );
  };
  return (
    <p
      onClick={handleSkipClick}
      className="fs-6 skip-text p-0 m-0 cursor-pointer"
    >
      Skip
      <FontAwesomeIcon className="ms-1" icon={faArrowRight} />
    </p>
  );
};

export { SkipButton };
