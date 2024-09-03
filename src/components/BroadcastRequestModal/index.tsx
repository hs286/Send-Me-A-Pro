import React, { useEffect, useState } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { PrimaryModal } from "../PrimaryModal";
import {
  AppDispatch,
  FilterOptionsModal,
  getFormsAction,
  postCreateRequestOpportunityAction,
  setBroadcastRequestIsVisibleAction,
} from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Accordion,
  Button,
  Col,
  Form,
  Image,
  ProgressBar,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  BOTTOM_BOX,
  IC_BOX,
  IC_SELECT,
  IC_TICK,
  MIDDLE_BOX,
  TOP_BOX,
} from "../../assets/images";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import moment from "moment";
import { DaysPicker } from "../DaysCalendar";

interface BroadcastRequestModalProps {
  isOpen: boolean;
  onHide: any;
  title: any;
}

const BroadcastRequestModal = (props: BroadcastRequestModalProps) => {
  const filterOptions: FilterOptionsModal = useSelector(
    (state: any) => state.trainers.filterOptions
  );
  const { profile } = useSelector((state: any) => state.user);
  const [forms, setForms] = useState<Array<any>>([]);
  const [formIndex, setFormIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { categories } = filterOptions;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!props.isOpen) {
      setFormIndex(0);
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      let categoryForm = {
        name: "Select speciality",
        describe: "select any one",
        sort: 0,
        questions: [
          {
            name: "Select speciality",
            description: "Select speciality",
            type: "SCQ",
            options: [...categories],
          },
        ],
      };
      setForms([{ ...categoryForm }]);
    }
  }, [categories]);

  const validateForm = () => {
    let questions = forms[formIndex].questions;
    let requiredQuestions = questions?.filter((x: any) => x.isRequired);
    let allAnswered = true;
    if (requiredQuestions) {
      for (let index = 0; index < requiredQuestions.length; index++) {
        const element = requiredQuestions[index];
        if (element.type === "SCQ") {
          const answered = element.options?.find((x: any) => x.selected);
          if (!answered) {
            allAnswered = false;
          }
        }
        if (element.type === "MCQ") {
          const answered = element.options?.filter((x: any) => x.selected);
          if (answered.length === 0) {
            allAnswered = false;
          }
        }
        if (element.type === "Location") {
          if (!element.address) {
            allAnswered = false;
          }
        }
        if (
          element.type === "Text" ||
          element.type === "Date" ||
          element.type === "Time" ||
          element.type === "Textarea"
        ) {
          if (!element.answer) {
            allAnswered = false;
          }
        }
        if (element.type === "Availability") {
          let indx = element.hours?.findIndex(
            (x: any) =>
              x.morning === true || x.afternoon === true || x.evening === true
          );
          if (!indx || indx === -1 || !element.preferredStartTime) {
            allAnswered = false;
          }
        }
      }
    }
    return allAnswered;
  };

  const submitAnswers = async () => {
    setLoading(true);
    let category = forms[0]?.questions[0]?.options?.find(
      (x: any) => x.selected
    );
    let body = {
      client_id: profile?.id,
      category_id: category?.id,
      responses: [...forms],
    };
    await dispatch(
      postCreateRequestOpportunityAction(
        body,
        () => {
          setLoading(false);
          toast("Request added successfully", { autoClose: 3000 });
          dispatch(setBroadcastRequestIsVisibleAction(false));
        },
        () => {
          setLoading(false);
          toast.error("Something went wrong!", { autoClose: 3000 });
        }
      )
    );
  };

  const handleOptionSelect = (
    questionIndex: number,
    optionsIndex: number,
    type: string
  ) => {
    let temp = [...forms];
    if (type === "SCQ") {
      temp[formIndex].questions[questionIndex].options?.map((x: any) => {
        x.selected = false;
        return x;
      });
    }
    temp[formIndex].questions[questionIndex].options[optionsIndex].selected =
      !temp[formIndex].questions[questionIndex].options[optionsIndex].selected;
    setForms(temp);
  };

  const handleNext = async () => {
    let finalStep = {
      name: "WHY CHOOSE SEND ME A PRO?",
      describe:
        "You will receive profiles of available pros soon or you can start searching all profiles.",
      questions: [
        {
          type: "WHY_CHOOSE",
        },
      ],
    };
    if (loading) {
      return;
    }
    if (formIndex === forms?.length - 1 && formIndex !== 0) {
      if (validateForm()) {
        submitAnswers();
      } else {
        toast.error("Please answer required question(s)", { autoClose: 3000 });
      }
      return;
    }
    if (formIndex === 0) {
      setLoading(true);
      let category = forms[0]?.questions[0]?.options?.find(
        (x: any) => x.selected
      );
      if (category) {
        const result: any = await dispatch(getFormsAction(category?.id || 44));
        let tempForms = [
          forms[0],
          ...result,
          { ...finalStep, sort: result?.length },
        ];
        setForms(tempForms);
        setFormIndex(formIndex + 1);
      }
      setLoading(false);
    } else {
      if (validateForm()) {
        if (formIndex !== forms.length - 1) {
          setFormIndex(formIndex + 1);
        }
      } else {
        toast.error("Please answer required question(s)", { autoClose: 3000 });
      }
    }
  };

  const renderFooter = () => {
    return (
      <Row className="justify-content-center w-100">
        <Col xs="12" sm="8" lg="5">
          <Row className="justify-content-end">
            {formIndex !== 0 ? (
              <Col xs={6}>
                <Button
                  variant="secondary"
                  className="font-family-poppins mt-2 w-100"
                  onClick={() => {
                    setFormIndex(formIndex - 1);
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" variant="light" />
                  ) : (
                    " Back"
                  )}
                </Button>
              </Col>
            ) : null}
            <Col xs={6}>
              <Button
                variant="primary"
                className="background-primary w-100 border-color-primary font-family-poppins text-light mt-2"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" animation="border" variant="light" />
                ) : formIndex === forms?.length - 1 && formIndex !== 0 ? (
                  "Finish"
                ) : (
                  "Next"
                )}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const renderOpenList = (question: any, indx: number) => {
    return question?.options?.map((option: any, index: number) => {
      const selected_image = option.checkType === "tick" ? IC_TICK : IC_SELECT;
      return (
        <div
          onClick={() => handleOptionSelect(indx, index, question.type)}
          className={`optionContainer ${
            option.selected ? "optionSelected" : ""
          }`}
        >
          {String(option.name).toLowerCase() !== "other" && option.icon ? (
            <></>
          ) : null}
          {option.name &&
          String(option.name).toLowerCase() === "other" &&
          option.othersArrow ? (
            <input
              onChange={(text: any) => option.onChangeOther(text)}
              placeholder="other"
            />
          ) : (
            <span>{option.name}</span>
          )}
          {String(option.name).toLowerCase() === "other" &&
          option.othersArrow ? null : (
            <Image
              className="option-tick"
              src={option.selected ? selected_image : IC_BOX}
            />
          )}
        </div>
      );
    });
  };

  const renderCollapseList = (question: any, indx: number) => {
    return (
      <Accordion className="mt-2">
        <Accordion.Item eventKey="10">
          <Accordion.Header className="item">
            <span className="ms-1">
              {question.type === "SCQ"
                ? "Please select one"
                : "Select all that apply"}
            </span>
          </Accordion.Header>
          <Accordion.Body>
            {question?.options?.map((option: any, index: number) => {
              const selected_image =
                option.checkType === "tick" ? IC_TICK : IC_SELECT;
              return (
                <div
                  onClick={() => handleOptionSelect(indx, index, question.type)}
                  className={`optionContainer ${
                    option.selected ? "optionSelected" : ""
                  }`}
                >
                  {String(option.name).toLowerCase() !== "other" &&
                  option.icon ? (
                    <></>
                  ) : null}
                  {option.name &&
                  String(option.name).toLowerCase() === "other" &&
                  option.othersArrow ? (
                    <input
                      onChange={(text: any) => option.onChangeOther(text)}
                      placeholder="other"
                    />
                  ) : (
                    <span>{option.name}</span>
                  )}
                  {String(option.name).toLowerCase() === "other" &&
                  option.othersArrow ? null : (
                    <Image
                      className="option-tick"
                      src={option.selected ? selected_image : IC_BOX}
                    />
                  )}
                </div>
              );
            })}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const renderTextInput = (questionIndex: number) => {
    return (
      <Form.Group className="m-0 mt-2">
        <Form.Control
          value={forms[formIndex]?.questions[questionIndex]?.answer || ""}
          onChange={(e) => {
            const tempForms = [...forms];
            tempForms[formIndex].questions[questionIndex].answer =
              e.target.value;
            setForms([...tempForms]);
          }}
          type="text"
          placeholder="Type here."
        />
      </Form.Group>
    );
  };

  const renderLocationInput = (questionIndex: number) => {
    return (
      <Form.Group className="m-0 mt-2">
        <GooglePlacesAutocomplete
          apiKey="AIzaSyC-uV3wsG3ALfeYMCU_i_RvlNs8pgHpj5E"
          selectProps={{
            location: "",
            onChange: async (place: any) => {
              let result: any = await geocodeByPlaceId(place?.value?.place_id);
              if (result?.length) {
                let _result: any = result[0];
                const questions = [...forms[formIndex].questions];
                questions[questionIndex].address = _result?.formatted_address;
                questions[questionIndex].location = _result?.geometry?.location;
                const tempForms = [...forms];
                tempForms[formIndex].questions = questions;

                // set city and state if form is mandatory location form
                if (forms[formIndex]?.id === -1) {
                  const state = _result?.address_components?.find((x: any) =>
                    x.types?.find(
                      (y: any) =>
                        y.toString().toLocaleLowerCase() ===
                        "administrative_area_level_1"
                    )
                  );
                  const city = _result?.address_components?.find((x: any) =>
                    x.types?.find(
                      (y: any) =>
                        y.toString().toLocaleLowerCase() === "locality"
                    )
                  );
                  if (state) {
                    questions[questions.findIndex((x) => x.id === 3)].answer =
                      state.long_name;
                  }
                  if (city) {
                    questions[questions.findIndex((x) => x.id === 2)].answer =
                      city.long_name;
                  }
                }
                setForms([...tempForms]);
              }
            },
          }}
        />
      </Form.Group>
    );
  };

  const renderDateInput = (questionIndex: number) => {
    return (
      <Form.Group className="m-0 mt-2">
        <Form.Control
          as={"input"}
          type="date"
          placeholder="Click to enter date"
          value={
            forms[formIndex]?.questions[questionIndex]?.answer
              ? moment(
                  forms[formIndex]?.questions[questionIndex]?.answer
                ).format("YYYY-MM-DD")
              : undefined
          }
          onChange={(event) => {
            let tempForms: any = [...forms];
            tempForms[formIndex].questions[questionIndex].answer = moment(
              event.target.value
            ).format("MMM DD YYYY");
            setForms([...forms]);
          }}
        ></Form.Control>
      </Form.Group>
    );
  };

  const renderTimeInput = (questionIndex: number) => {
    return (
      <Form.Group className="m-0 mt-2">
        <Form.Control
          as={"input"}
          type="time"
          placeholder="Click to enter date"
          value={moment(
            forms[formIndex]?.questions[questionIndex]?.answer,
            "HH:mm"
          ).format("HH:mm")}
          onChange={(event) => {
            let tempForms: any = [...forms];
            tempForms[formIndex].questions[questionIndex].answer =
              event.target.value;

            setForms([...forms]);
          }}
        ></Form.Control>
      </Form.Group>
    );
  };

  const renderTextarea = (placeholder: string, questionIndex: number) => {
    return (
      <Form.Group className="m-0 mt-2">
        <Form.Control
          as={"textarea"}
          type="text"
          placeholder={placeholder}
          value={forms[formIndex]?.questions[questionIndex]?.answer}
          className="height-100px"
          onChange={(event) => {
            let tempForms: any = [...forms];
            tempForms[formIndex].questions[questionIndex].answer =
              event.target.value;

            setForms([...forms]);
          }}
        ></Form.Control>
      </Form.Group>
    );
  };

  const renderWeeklyAvailabilityCalender = (questionIndex: number) => {
    return (
      <DaysPicker
        defaultSelected={[]}
        preferredTime={
          forms[formIndex].questions[questionIndex].preferredStartTime
        }
        onSelect={(e: any) => {
          let tempForms = [...forms];
          tempForms[formIndex].questions[questionIndex].hours = e;
          setForms(tempForms);
        }}
        onPreferredTimeSelect={(e: any) => {
          let tempForms = [...forms];

          tempForms[formIndex].questions[questionIndex].preferredStartTime =
            moment(e, "HH:mm:ss").format("hh:mm a");
          setForms(tempForms);
        }}
        onPreferredFlexibleSelect={(e: any) => {
          let tempForms = [...forms];
          tempForms[formIndex].questions[questionIndex].isFlexibleTime = e;
          setForms(tempForms);
        }}
      />
    );
  };
  const renderWhyChooseSection = () => {
    return (
      <div className="d-flex flex-column align-items-center">
        <div className="d-flex align-items-center element-wrapper mb-3">
          <Image style={{ width: "65px" }} src={BOTTOM_BOX} />
          <div className="ms-2">
            <p className="m-0 text-bold why-heading">standard pricing</p>
            <p className="mt-1 why-description">
              With our fair rates, no more wasting time getting quotes and
              negotiating.(Save Time!)
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center element-wrapper mb-3">
          <Image style={{ width: "65px" }} src={MIDDLE_BOX} />
          <div className="ms-2">
            <p className="m-0 text-bold why-heading">Work with any Pro</p>
            <p className="mt-1 why-description">
              No commitment to one pro, book any of our qualified and vetted
              pros at any time.
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center element-wrapper mb-3">
          <Image style={{ width: "65px" }} src={TOP_BOX} />
          <div className="ms-2">
            <p className="m-0 text-bold why-heading">Secure and Simple</p>
            <p className="mt-1 why-description">
              Easily make payments and track sessions all on our app.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PrimaryModal
      isOpen={props.isOpen}
      onHide={() => {
        props.onHide();
      }}
      size={"xl"}
      centered={true}
      fullscreen={true}
      title={props.title}
      footer={renderFooter()}
    >
      <Row className="contentWrapper justify-content-center">
        <Col xs="12" sm="8" lg="5">
          <div style={{ flexDirection: "row" }}>
            <ProgressBar
              variant="info"
              now={
                formIndex !== 0 ? (100 / forms?.length) * (formIndex + 1) : 15
              }
            />
            <p className="w-100 mt-2 mb-0 text-center name-text">
              {forms[formIndex]?.name}
            </p>
            <p className="w-100 mt-1 text-center desctiption-text">
              {forms[formIndex]?.describe}
            </p>
          </div>
          {forms[formIndex]?.questions?.map((question: any, index: number) => {
            return (
              <>
                <div style={{ width: "100%", marginTop: 10 }}>
                  {(question.type === "SCQ" ||
                    question.type === "MCQ" ||
                    question.type === "Availability") &&
                  forms[formIndex]?.questions.length === 1 ? null : (
                    <span style={{ color: "black" }}>
                      {question.name}
                      {question.isRequired ? " *" : ""}
                    </span>
                  )}
                  {(question.type === "SCQ" || question.type === "MCQ") &&
                  forms[formIndex]?.questions.length === 1
                    ? renderOpenList(question, index)
                    : (question.type === "SCQ" || question.type === "MCQ") &&
                      forms[formIndex]?.questions.length > 1
                    ? renderCollapseList(question, index)
                    : question.type === "Text"
                    ? renderTextInput(index)
                    : question.type === "Location"
                    ? renderLocationInput(index)
                    : question.type === "Date"
                    ? renderDateInput(index)
                    : question.type === "Time"
                    ? renderTimeInput(index)
                    : question.type === "Availability"
                    ? renderWeeklyAvailabilityCalender(index)
                    : question.type === "Textarea"
                    ? renderTextarea(question.placeholder, index)
                    : question.type === "WHY_CHOOSE"
                    ? renderWhyChooseSection()
                    : null}
                </div>
              </>
            );
          })}
        </Col>
      </Row>
    </PrimaryModal>
  );
};

BroadcastRequestModal.propTypes = {
  isOpen: PropTypes.bool,
  onHide: PropTypes.any,
  title: PropTypes.any,
};

export { BroadcastRequestModal };
