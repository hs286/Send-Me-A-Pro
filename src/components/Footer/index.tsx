import React from "react";
import { Col, Container, Image, Row, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FACEBOOK,
  INSTAGRAM,
  // TWITTER,
  AVAILABLE_ON_APP_STORE,
  AVAILABLE_ON_PLAY_STORE,
} from "../../assets/images";
import "./style.css";

const Footer = () => {
  const { selectedFranchise } = useSelector((state: any) => state.user);

  const getUrl: any = (type: string) => {
    let url = type;
    if (selectedFranchise?.name) {
      url = `${selectedFranchise?.domain}/${type}`;
    }
    return url;
  };

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Container className="mt-5 border-top pt-5 pb-5 container-colr">
      <Row>
        <Col
          xxl="6"
          xl="6"
          lg="6"
          md="8"
          sm="12"
          className="d-flex align-items-center"
        >
          <span className="color-secondary copyright">
            © 2022 sendmeatrainer.com{" "}
            <Link to={getUrl("TAC")} target={"_blank"}>
              Terms & Conditions
            </Link>{" "}
            / Cookie policy /{" "}
            <Link to={getUrl("PP")} target={"_blank"}>
              Privacy policy
            </Link>{" "}
          </span>
        </Col>
        <Col xxl="2" xl="2" lg="3" md="4" sm="5" className="mt-lg-0 mt-2">
          <Stack gap={2} direction="horizontal">
            <img
              role="button"
              onClick={() =>
                openInNewTab(
                  selectedFranchise?.instagram ||
                    "https://www.instagram.com/sendmeatrainer/"
                )
              }
              src={INSTAGRAM}
              alt="instagram"
            />
            {/* <img
              role="button"
              onClick={() => openInNewTab("https://twitter.com/sendmeatrainer")}
              src={TWITTER}
              alt="twitt"
            /> */}
            <img
              role="button"
              onClick={() =>
                openInNewTab(
                  selectedFranchise?.facebook ||
                    "https://www.facebook.com/Sendmeatrainer/"
                )
              }
              src={FACEBOOK}
              alt="fb"
            />
          </Stack>
        </Col>
        <Col
          xxl="2"
          xl="2"
          lg="1"
          md="8"
          sm="3"
          xs="6"
          className="d-flex align-items-center justify-content-end mt-lg-0 mt-2"
        >
          <span className="color-secondary copyright">Download The App</span>
        </Col>
        <Col
          xxl="1"
          xl="1"
          lg="1"
          md="2"
          sm="2"
          xs="3"
          className="mt-lg-0 mt-2"
        >
          <a
            href="https://apps.apple.com/in/app/send-me-a-pro/id6444440266"
            target="_blank"
            rel="noreferrer"
          >
            <Image src={AVAILABLE_ON_APP_STORE} alt="Send me a Trainer" fluid />
          </a>
        </Col>
        <Col
          xxl="1"
          xl="1"
          lg="1"
          md="2"
          sm="2"
          xs="3"
          className="mt-lg-0 mt-2"
        >
          <a
            href="https://play.google.com/store/apps/details?id=com.smap.user"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={AVAILABLE_ON_PLAY_STORE}
              alt="available on play store"
              fluid
            />
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export { Footer };
