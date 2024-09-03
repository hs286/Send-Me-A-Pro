import React from "react";
import "./style.css";
import { Col, Container, Row } from "react-bootstrap";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ThankYou = () => {
  return (
    <Container>
      <Row className="main-row w-100 justify-content-center align-items-center">
        <Col className="d-flex justify-content-center align-items-center flex-column mt-5">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="color-primary"
            style={{ fontSize: 100 }}
          />
          <h1 className="mt-4">Thank You</h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>

          <ul className="w-100">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Ut sit amet velit mollis, rutrum lacus at, gravida velit.</li>
            <li>Integer at mi id magna pharetra rutrum.</li>
            <li>Sed porta lectus sit amet massa ornare aliquam.</li>

            <li>
              Sed id tortor euismod, tempor lacus bibendum, pellentesque dolor.
            </li>
            <li>Suspendisse sed quam a urna venenatis ornare.</li>
            <li>
              Vivamus et diam elementum, accumsan ligula sit amet, blandit
              felis.
            </li>
            <li>
              Aliquam luctus lectus id dolor maximus, vel hendrerit mi
              imperdiet.
            </li>
            <li>Etiam egestas nisi non pellentesque hendrerit.</li>
            <li>
              Nullam dignissim orci ut nisl aliquam, eget lacinia sem iaculis.
            </li>
            <li>Sed ac ex ac tortor varius fringilla.</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export { ThankYou };
