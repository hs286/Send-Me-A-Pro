import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import {
  addCertificatesAction,
  addSpecialityAction,
  AppDispatch,
  CountryModal,
  FranchiseModal,
  getTrainerCategories,
  getTrainerCertificates,
  getTrainerLanguages,
  getTrainerSpecialities,
  postTrainerAddDetailsAction,
  providerManualSignupAction,
} from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Nav,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  IC_BOX,
  IC_SELECT,
  IC_TICK,
  LOGO,
  DISABLED,
} from "../../assets/images";
import {
  faAngleLeft,
  faEnvelopeOpenText,
  faEye,
  faEyeSlash,
  faRegistered,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { emailRegex, mobileRegex } from "./helpers";
import PhoneInput from "react-phone-number-input";

const ProviderSignUp = () => {
  const {
    trainerSpecialities,
    trainerCertificates,
    trainerLanguages,
    trainerCategories,
    newSpeciality,
    newCertificate,
  } = useSelector((state: any) => state.trainers);
  const { countries, franchiseList } = useSelector((state: any) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);

  const [forms, setForms] = useState<Array<any>>([]);
  const [formIndex, setFormIndex] = useState(0);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [postCode, setPostCode] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [dob, setDob] = useState("");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [state, setState] = useState("");
  const [SSN, setSSN] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [emirate, setEmirate] = useState("");
  const [, setCurrency] = useState("USD");
  const [gender, setGender] = useState<string>("");
  const [selectedCountryLocal, setSelectedCountryLocal] = useState<number>(-1);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [localFranchiseList, setLocalFranchiseList] = useState<
    Array<FranchiseModal>
  >([]);
  const [isSignUpChecked, setIsSignUpChecked] = useState<boolean>(false);
  const [selectedFranchiseLocal, setSelectedFranchiseLocal] = useState<
    number | undefined
  >(-1);
  const [languageCount, setLanguageCount] = useState(0);
  const [errors, setErrors] = useState<any>({
    firstNameError: "",
    lastNameError: "",
    passwordError: "",
    confirmPasswordError: "",
    addressError: "",
    zipCodeError: "",
    postCodeError: "",
    stateError: "",
    emailError: "",
    phoneError: "",
    dobError: "",
    SSNError: "",
    countyError: "",
    emirateError: "",
  });
  const years: any = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i);
  }
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  const firstNameHandler = (text: string) => {
    setFirstName(text);
    setErrors({ ...errors, firstNameError: "" });
  };

  const lastNameHandler = (text: string) => {
    setLastName(text);
    setErrors({ ...errors, lastNameError: "" });
  };

  const emailHandler = (text: string) => {
    setEmail(text);
    setErrors({ ...errors, emailError: "" });
  };

  const passwordHandler = (text: string) => {
    setPassword(text);
    setErrors({ ...errors, passwordError: "" });
  };

  const confirmPasswordHandler = (text: string) => {
    setConfirmPassword(text);
    setErrors({ ...errors, confirmPasswordError: "" });
  };

  const phoneHandler = (text: string) => {
    setPhone(text);
    setErrors({ ...errors, phoneError: "" });
  };

  const zipCodeHandler = (text: string) => {
    setZipCode(text);
    setErrors({ ...errors, zipCodeError: "" });
  };

  const postCodeHandler = (text: string) => {
    setPostCode(text);
    setErrors({ ...errors, postCodeError: "" });
  };

  const countyHandler = (text: string) => {
    setCounty(text);
    setErrors({ ...errors, countyError: "" });
  };

  const stateHandler = (text: string) => {
    setState(text);
    setErrors({ ...errors, stateError: "" });
  };

  const cityHandler = (text: string) => {
    setCity(text);
    setErrors({ ...errors, cityError: "" });
  };

  const emirateHandler = (text: string) => {
    setEmirate(text);
    setErrors({ ...errors, emirateError: "" });
  };

  const addressHandler = (text: string) => {
    setAddress(text);
    setErrors({ ...errors, addressError: "" });
  };

  const dobHandler = (text: string) => {
    setErrors({ ...errors, dobError: "" });
    const currentDate = moment().valueOf();
    const selectDate = moment(text).valueOf();
    if (selectDate > currentDate) {
      setErrors({ ...errors, dobError: "You cannot select the future date" });
      setDob("");
      return;
    }
    setErrors({ ...errors, dobError: "" });
    setDob(moment(text).format());
  };

  const SSNHandler = (text: string) => {
    setErrors({ ...errors, SSNError: "" });
    setSSN(text);
  };

  const genderHandler = (text: string) => {
    setGender(text);
  };

  const franchiseHandler = (id: number) => {
    setSelectedFranchiseLocal(id);
    setErrors({ ...errors, franchiseError: "" });
  };

  useEffect(() => {
    dispatch(getTrainerSpecialities());
    dispatch(getTrainerCertificates());
    dispatch(getTrainerLanguages());
    dispatch(getTrainerCategories());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countries?.length > 0 && franchiseList?.length > 0) {
      setLocalFranchiseList(
        franchiseList?.filter(
          (x: FranchiseModal) => x.country_id === selectedCountryLocal
        )
      );
    }
  }, [countries, franchiseList, selectedCountryLocal]);

  useEffect(() => {
    if (newSpeciality?.[0]?.id) {
      handleDefaultSelect(1, newSpeciality[0]?.id);
      setSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newSpeciality?.[0]?.id]);

  useEffect(() => {
    if (newCertificate?.[0]?.id) {
      handleDefaultCertificateSelect(1, newCertificate[0]?.id);
      setSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCertificate?.[0]?.id]);

  useEffect(() => {
    let formData = [];

    if (trainerCategories && trainerCategories?.length > 0) {
      let servicesForm = {
        name: "What service do you provide?",
        describe: "(Check all that apply)",
        sort: 0,
        questions: [
          {
            name: "Select certificates",
            description: "Select certificates",
            type: "MCQ",
            isRequired: true,
            options: [...trainerCategories],
          },
        ],
      };
      formData.push({ ...servicesForm });
    }

    if (trainerSpecialities && trainerSpecialities.length > 0) {
      let specialitiesForm = {
        name: "Type in the specialities that you offer in the services you selected, if applicable. ",
        describe: "(Example: Calculus, Acoustic Guitar, Pre-Post Natal PT)",
        sort: 0,
        questions: [
          {
            type: "Search",
            placeholder: "Add a tag...",
          },
          {
            type: "MCQ",
            detail: "specialities",
            isRequired: true,
            options: [...trainerSpecialities],
          },
        ],
      };
      formData.push({ ...specialitiesForm });
    }
    if (trainerLanguages && trainerLanguages.length > 0) {
      let languagesForm = {
        name: "What languages do you speak? ",
        describe: "(Check all that apply)",
        sort: 0,
        questions: [
          {
            name: "Select languages",
            description: "Select languages",
            type: "MCQ",
            isRequired: true,
            options: [...trainerLanguages],
          },
        ],
      };
      formData.push({ ...languagesForm });
    }

    let professionForm = {
      name: "What is your profession?Title?",
      describe: "This will be displayed on your profile header",
      sort: 0,
      questions: [
        {
          name: "What is your profession?",
          type: "Text",
          isRequired: true,
        },
        {
          name: "What year did you start practicing this profession?",
          type: "Date",
          isRequired: true,
        },
        {
          name: "Add your bio.",
          type: "Textarea",
          isRequired: true,
        },
      ],
    };
    formData.push({ ...professionForm });

    if (trainerCertificates && trainerCertificates.length > 0) {
      let option = [...trainerCertificates];
      let certificatesForm = {
        name: "Add education / certifications that will display on your profile",
        describe:
          "(Example: Bachelors in English, Masters in Engineering, NASM Certified Trainer, CPR)",
        sort: 0,
        questions: [
          {
            type: "Search",
            placeholder: "Type your education...",
          },
          {
            detail: "certificates",
            type: "MCQ",
            isRequired: true,
            options: option,
          },
        ],
      };
      formData.push({ ...certificatesForm });
    }

    const newFormData = formData.map((data, index) => {
      const updaterFormData = forms;
      const updatedDataIndex = updaterFormData.findIndex(
        (fromData) => fromData.name === data.name
      );

      if (updatedDataIndex && updatedDataIndex >= 0) {
        return updaterFormData[updatedDataIndex];
      } else {
        return data;
      }
    });
    setForms(newFormData);
    // eslint-disable-next-line
  }, [
    trainerCategories,
    trainerCertificates,
    newCertificate?.[0]?.id, // eslint-disable-line
    trainerSpecialities,
    trainerLanguages,
  ]);

  const countryHandler = (text: string) => {
    setSelectedCountryLocal(+text);
    const data = countries.filter((item: any) => item?.id == text); // eslint-disable-line
    setCurrency(data[0]?.currency);
    setErrors({ ...errors, countryError: "" });
  };
  const [error, setError] = useState("");

  const validateForm = () => {
    let questions = forms[formIndex]?.questions;
    let requiredQuestions = questions?.filter((x: any) => x.isRequired);
    let allAnswered = true;
    if (requiredQuestions) {
      for (let index = 0; index < requiredQuestions.length; index++) {
        const element = requiredQuestions[index];
        if (element.type === "SCQ") {
          const answered = element.options?.find((x: any) => x.selected);
          if (!answered) {
            allAnswered = false;
            return allAnswered;
          }
        }
        if (element.type === "MCQ") {
          const answered = element.options?.filter((x: any) => x.selected);
          if (answered.length === 0) {
            allAnswered = false;
            return allAnswered;
          }
          if (answered.length > 10) {
            toast.error("Please select less than 10", { autoClose: 3000 });
            return;
          }
        }
        if (element.type === "Location") {
          if (!element.address) {
            allAnswered = false;
            return allAnswered;
          }
        }

        if (element.type === "Date" && year === "") {
          allAnswered = false;
          setError("Year is required");
          return allAnswered;
        }
        if (element.type === "Textarea" && bio === "") {
          allAnswered = false;
          setError("Bio is required");
          return allAnswered;
        }
        if (element.type === "Text" && title === "") {
          allAnswered = false;
          setError("Title is required");
          return allAnswered;
        }
        const regex = /^[a-zA-Z\s]+$/;
        if (element.type === "Text" && !regex.test(title)) {
          allAnswered = false;
          setError("Symbols and numbers are not allowed.");
          return allAnswered;
        }
        if (element.type === "Availability") {
          let indx = element.hours?.findIndex(
            (x: any) =>
              x.morning === true || x.afternoon === true || x.evening === true
          );
          if (!indx || indx === -1 || !element.preferredStartTime) {
            allAnswered = false;
            return allAnswered;
          }
        }
      }
      saveInLocalStorage();
      return true;
    }
  };

  const validate = () => {
    let hasError = false;
    let _errors: any = {
      firstNameError: "",
      lastNameError: "",
      emailError: "",
      phoneError: "",
      passwordError: "",
      confirmPasswordError: "",
      countryError: "",
      franchiseError: "",
    };

    if (firstName === "") {
      hasError = true;
      _errors = { ..._errors, firstNameError: "Field cannot be empty" };
    } else if (firstName?.length < 2) {
      hasError = true;
      _errors = { ..._errors, firstNameError: "Please enter a valid name" };
    }
    if (lastName === "") {
      hasError = true;
      _errors = { ..._errors, lastNameError: "Field cannot be empty" };
    } else if (lastName?.length < 2) {
      hasError = true;
      _errors = { ..._errors, lastNameError: "Please enter a valid name" };
    }
    if (address === "") {
      hasError = true;
      _errors = { ..._errors, addressError: "Field cannot be empty" };
    } else if (address?.length < 2) {
      hasError = true;
      _errors = { ..._errors, addressError: "Please enter a valid address" };
    }
    if (
      city === "" &&
      (selectedCountryLocal === 1 ||
        selectedCountryLocal === 11 ||
        selectedCountryLocal === 31)
    ) {
      hasError = true;
      _errors = { ..._errors, cityError: "Field cannot be empty" };
    } else if (
      city?.length < 2 &&
      (selectedCountryLocal === 1 ||
        selectedCountryLocal === 11 ||
        selectedCountryLocal === -1 ||
        selectedCountryLocal === 31)
    ) {
      hasError = true;
      _errors = { ..._errors, cityError: "Please enter a valid city" };
    }
    if (
      state === "" &&
      (selectedCountryLocal === 1 ||
        selectedCountryLocal === 31 ||
        selectedCountryLocal === -1)
    ) {
      hasError = true;
      _errors = { ..._errors, stateError: "Field cannot be empty" };
    } else if (
      state?.length < 2 &&
      (selectedCountryLocal === 1 || selectedCountryLocal === 31)
    ) {
      hasError = true;
      _errors = { ..._errors, stateError: "Please enter a valid city" };
    }
    if (emirate === "" && selectedCountryLocal === 21) {
      hasError = true;
      _errors = { ..._errors, emirateError: "Field cannot be empty" };
    } else if (emirate?.length < 2 && selectedCountryLocal === 21) {
      hasError = true;
      _errors = { ..._errors, emirateError: "Please enter a emirate" };
    }
    if (county === "" && selectedCountryLocal === 11) {
      hasError = true;
      _errors = { ..._errors, countyError: "Field cannot be empty" };
    } else if (county?.length < 2 && selectedCountryLocal === 11) {
      hasError = true;
      _errors = { ..._errors, countyError: "Please enter a valid county" };
    }
    if (
      zipCode === "" &&
      (selectedCountryLocal === 1 ||
        selectedCountryLocal === 31 ||
        selectedCountryLocal === -1)
    ) {
      hasError = true;
      _errors = { ..._errors, zipCodeError: "Field cannot be empty" };
    } else if (
      zipCode?.length < 2 &&
      (selectedCountryLocal === 1 || selectedCountryLocal === 31)
    ) {
      hasError = true;
      _errors = { ..._errors, zipCodeError: "Please enter a valid Zip Code" };
    }

    if (postCode === "" && selectedCountryLocal === 11) {
      hasError = true;
      _errors = { ..._errors, postCodeError: "Field cannot be empty" };
    } else if (postCode?.length < 2 && selectedCountryLocal === 11) {
      hasError = true;
      _errors = { ..._errors, zipCodeError: "Please enter a valid Post Code" };
    }
    const dobMoment = moment(dob, "YYYY-MM-DD");

    // Calculate the date 18 years ago from today
    const eighteenYearsAgo = moment().subtract(18, "years");

    // Compare the DOB to 18 years ago
    if (dobMoment.isAfter(eighteenYearsAgo)) {
      hasError = true;
      _errors = { ..._errors, dobError: "You are too young" }; // DOB is less than 18 years ago
    }
    if (dob === "") {
      hasError = true;
      _errors = { ..._errors, dobError: "Field cannot be empty" };
    } else if (dob?.length < 2) {
      hasError = true;
      _errors = { ..._errors, dobError: "Please enter a valid Date of Birth" };
    }
    if (SSN === "" && selectedCountryLocal === 1) {
      hasError = true;
      _errors = { ..._errors, SSNError: "Field cannot be empty" };
    } else if (SSN?.length !== 4 && selectedCountryLocal === 1) {
      hasError = true;
      _errors = { ..._errors, SSNError: "Please enter last 4 SSN" };
    }
    if (email === "") {
      hasError = true;
      _errors = { ..._errors, emailError: "Field cannot be empty" };
    } else if (!emailRegex.test(email)) {
      hasError = true;
      _errors = { ..._errors, emailError: "Please enter a valid Email" };
    }
    if (phone === "") {
      hasError = true;
      _errors = { ..._errors, phoneError: "Field cannot be empty" };
    } else if (phone?.length < 10) {
      hasError = true;
      _errors = { ..._errors, phoneError: "Please enter a valid Phone number" };
    } else if (!mobileRegex.test(phone)) {
      hasError = true;
      _errors = { ..._errors, phoneError: "Please enter a valid Phone number" };
    }
    if (password === "") {
      hasError = true;
      _errors = { ..._errors, passwordError: "Field cannot be empty" };
    } else if (password?.length < 8) {
      hasError = true;
      _errors = {
        ..._errors,
        passwordError: "Password must contain atleast 8 characters",
      };
    }
    if (confirmPassword === "") {
      hasError = true;
      _errors = { ..._errors, confirmPasswordError: "Field cannot be empty" };
    } else if (confirmPassword !== password) {
      hasError = true;
      _errors = { ..._errors, confirmPasswordError: "Password does not match" };
    }
    if (selectedCountryLocal === 0 || selectedCountryLocal === -1) {
      hasError = true;
      _errors = { ..._errors, countryError: "Please select a country" };
    }
    if (selectedFranchiseLocal === 0 || selectedCountryLocal === -1) {
      hasError = true;
      _errors = { ..._errors, franchiseError: "Please select a franchise" };
    }

    setErrors(_errors);
    return hasError;
  };

  const saveInLocalStorage = () => {
    const dataToSave = {
      categories: forms[0]?.questions[0]?.options
        ?.filter((x: any) => x.selected)
        ?.map((category: any) => ({ category_id: category.id })),
      specialities: forms[1]?.questions[1]?.options
        ?.filter((x: any) => x.selected)
        ?.map((speciality: any) => ({ speciality_id: speciality.id })),
      languages: forms[2]?.questions[1]?.options
        ?.filter((x: any) => x.selected)
        ?.map((language: any) => ({ language_id: language.id })),
      professional_data: {
        bio: bio,
        title: title,
        start_year: year,
      },
      certificates: forms[4]?.questions[1]?.options
        ?.filter((x: any) => x.selected)
        ?.map((certificate: any) => ({ certificate_id: certificate.id })),
    };
    localStorage.setItem("saved_data", JSON.stringify(dataToSave));
  };

  const submitAnswers = async (
    data: any,
    successCallback?: (data: any) => void,
    errorCallback?: (error: any) => void
  ) => {
    setIsLoading(true);
    let categories = forms[0]?.questions[0]?.options?.filter(
      (x: any) => x.selected
    );

    let categories_id = categories?.map((category: any) => {
      return { category_id: category.id };
    });
    let specialities = forms[1]?.questions[1]?.options?.filter(
      (x: any) => x.selected
    );

    let specialities_id = specialities?.map((speciality: any) => {
      return { speciality_id: speciality.id };
    });
    let languages = forms[2]?.questions[0]?.options?.filter(
      (x: any) => x.selected
    );

    let languages_id = languages?.map((language: any) => {
      return { language_id: language.id };
    });
    let certificates = forms[4]?.questions[1]?.options?.filter(
      (x: any) => x.selected
    );

    let certificates_id = certificates?.map((certificate: any) => {
      return { certification_id: certificate.id };
    });

    let body = {
      client_id: data?.id,
      categories: categories_id,
      specialities: specialities_id,
      languages: languages_id,
      certifications: certificates_id,
      bio: bio,
      title: title,
      start_year: +moment(year).format("YYYY"),
    };

    await dispatch(
      postTrainerAddDetailsAction(
        data?.id,
        body,
        (data: any) => {
          successCallback && successCallback(data);
          setIsLoading(false);
          setSuccess(true);
        },
        (error: any) => {
          toast(error, { autoClose: 3000 });
          errorCallback && errorCallback(error);
          setIsLoading(false);
        }
      )
    );
    setIsLoading(false);
    toast.success("User registered successfully", { autoClose: 3000 });
    setFormIndex(formIndex + 1);
  };

  const handleOptionSelect = (questionIndex: number, id: any, type: string) => {
    let count = languageCount;
    let temp = [...forms];
    if (type === "SCQ") {
      temp[formIndex].questions[questionIndex].options?.map((x: any) => {
        x.selected = false;
        return x;
      });
    }

    temp[formIndex]?.questions[questionIndex]?.options?.forEach((x: any) => {
      if (x?.id === id) {
        if (x?.selected) {
          if (formIndex === 2) {
            count--;
          }
          x.selected = false;
        } else {
          if (languageCount > 9 && formIndex === 2) {
            return;
          }
          if (formIndex === 2) {
            count++;
          }
          x.selected = true;
        }
      }
    });
    setForms(temp);
    setLanguageCount(count);
  };

  const handleDefaultSelect = (questionIndex: number, id: any) => {
    let temp = [...forms];

    if (newSpeciality[0]?.id) {
      let addNewSpeciality = newSpeciality[0];
      addNewSpeciality.selected = true;
      temp[formIndex]?.questions[questionIndex]?.options.push(addNewSpeciality);
    }

    setForms(temp);
  };
  const handleDefaultCertificateSelect = (questionIndex: number, id: any) => {
    let temp = [...forms];

    if (newCertificate[0]?.id) {
      let addNewCertificate = newCertificate[0];
      addNewCertificate.selected = true;
      temp[formIndex]?.questions[questionIndex]?.options.push(
        addNewCertificate
      );
    }

    setForms(temp);
  };

  const handleNext = async () => {
    if (isLoading) {
      return;
    }

    if (formIndex === forms?.length - 1 && formIndex !== 0) {
      if (validateForm()) {
        setFormIndex(formIndex + 1);
        return;
      }

      if (error === "" && formIndex !== 3) {
        setError("Please answer required question(s)");
        return;
      }
    }
    if (validateForm()) {
      if (formIndex !== forms.length) {
        setFormIndex(formIndex + 1);
      }
      return;
    }

    if (error === "" && formIndex !== 3) {
      setError("Please answer required question(s)");
      return;
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { autoClose: 3000 });
      setError("");
    }
  }, [error]);
  const handleSignUp = () => {
    if (!validate()) {
      setIsLoading(true);
      const seletedFranchiseObj: FranchiseModal = franchiseList.find(
        (franchise: FranchiseModal) => franchise.id === selectedFranchiseLocal
      );
      const selectedCountryObj: CountryModal = countries.find(
        (contry: CountryModal) => contry.id === selectedCountryLocal
      );
      dispatch(
        providerManualSignupAction(
          {
            role: "TR",
            email: email,
            firstname: firstName,
            lastname: lastName,
            password: password,
            zipcode: zipCode,
            dob: moment(dob).format("YYYY-MM-DD"),
            gender: gender,
            phone: phone,
            user_country: selectedCountryObj?.iso,
            country_id: selectedCountryObj?.id,
            franchise: [
              { franchise_id: seletedFranchiseObj?.id, active: true },
            ],
            individual_address_city: city,
            fromAdmin: false,
            individual_address_country: selectedCountryObj?.iso,
            individual_address_line1: address,
            individual_address_state: state,
            individual_phone: phone,
            individual_ssn_last_4: SSN,
          },
          (data: any) => {
            submitAnswers(data);
            setIsLoading(false);
            setIsVerificationOpen(true);
          },
          (error) => {
            setIsLoading(false);
          }
        )
      );
    }
  };

  const renderFooter = () => {
    return (
      <Row className="w-100 p-0 m-0">
        <Col xs={6}>
          {formIndex === forms.length - 10 ||
          formIndex === 0 ||
          formIndex === 5 ||
          formIndex === forms.length - 20 ? null : (
            <Button
              variant="secondary"
              className="font-family-poppins w-100 mt-2"
              onClick={() => {
                setSearch("");
                setFormIndex(formIndex - 1);
              }}
            >
              Back
            </Button>
          )}
          {formIndex === 5 && (
            <Button
              variant="secondary"
              className="font-family-poppins w-100 mt-2"
              onClick={() => {
                setSearch("");
                setFormIndex(formIndex + 1);
              }}
            >
              SKIP
            </Button>
          )}
        </Col>
        <Col
          xs={
            // formIndex === 0 ||
            // formIndex === forms.length - 1 ||
            // formIndex === forms.length - 2
            //   ? 12
            // :
            6
          }
        >
          <Button
            variant="primary"
            className="background-primary border-color-primary font-family-poppins text-light w-100 mt-2 rounded-3"
            onClick={() => {
              handleNext();
              setSearch("");
            }}
          >
            {isLoading ? (
              <Spinner size="sm" animation="border" variant="light" />
            ) : formIndex === 5 ? (
              "Confirm"
            ) : forms?.length - 2 ? (
              "Next >"
            ) : formIndex === forms?.length - 1 && formIndex !== 0 ? (
              "Finish"
            ) : (
              "Next"
            )}
          </Button>
        </Col>
      </Row>
    );
  };

  const renderSearchCollapseList = (question: any, indx: number) => {
    const filteredOptions = (question?.options || [])
      .filter((option: any) => {
        if (
          String(option.name).toLowerCase().includes(search) ||
          option.selected
        ) {
          return option;
        }
        return false;
      })
      .filter(Boolean);
    const data = question?.options?.slice().reverse();
    return (
      <div>
        {search !== "" &&
          !question?.options?.find(function (element: any) {
            return element.name.toLowerCase() === search.toLowerCase();
          }) && (
            <div className="w-100 d-flex justify-content-end">
              <Button
                className=""
                onClick={() => {
                  const regex = /^[a-zA-Z\s]+$/;
                  if (!regex.test(search)) {
                    toast.error("Symbols and numbers are not allowed.", {
                      autoClose: 3000,
                    });
                  } else if (
                    regex.test(search) &&
                    question?.detail === "specialities"
                  ) {
                    dispatch(
                      addSpecialityAction({
                        specialties: [
                          {
                            name: search,
                          },
                        ],
                      })
                    );
                  } else if (regex.test(search)) {
                    dispatch(
                      addCertificatesAction({
                        certifications: [
                          {
                            name: search,
                          },
                        ],
                      })
                    );
                  }
                }}
              >
                Add
              </Button>
            </div>
          )}

        {search === "" ? (
          data?.map((option: any, index: number) => {
            const selected_image =
              option.checkType === "tick" ? IC_TICK : IC_SELECT;
            return (
              <>
                <div
                  key={index}
                  onClick={() =>
                    handleOptionSelect(indx, option?.id, question.type)
                  }
                  className={`${styles.optionContainer} ${
                    option.selected
                      ? `${styles.optionSelected} background-light`
                      : ""
                  } rounded p-2 my-1`}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {String(option.name).toLowerCase() !== "other" &&
                  option.icon ? (
                    <></>
                  ) : (
                    <></>
                  )}
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
                      className={`${styles.optionTick} me-3`}
                      src={
                        option.selected
                          ? selected_image
                          : languageCount > 9 && formIndex === 2
                          ? DISABLED
                          : IC_BOX
                      }
                    />
                  )}
                </div>
              </>
            );
          })
        ) : filteredOptions?.length ? (
          filteredOptions?.map((option: any, index: number) => {
            const selected_image =
              option.checkType === "tick" ? IC_TICK : IC_SELECT;

            return (
              <>
                <div
                  key={index}
                  onClick={() => handleOptionSelect(indx, option?.id, "MCQ")}
                  className={`optionContainer ${
                    option.selected ? "optionSelected" : ""
                  }`}
                >
                  {String(option.name).toLowerCase() !== "other" &&
                  option.icon ? (
                    <></>
                  ) : (
                    <></>
                  )}
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
                      className={styles.optionTick}
                      src={option.selected ? selected_image : IC_BOX}
                    />
                  )}
                </div>
              </>
            );
          })
        ) : (
          <></>
        )}
      </div>
    );
  };

  const renderSearchTextInput = (
    questionIndex: number,
    placeholder: string
  ) => {
    return (
      <Form.Group className="m-0 mt-2">
        <Form.Control
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder={placeholder}
        />
      </Form.Group>
    );
  };
  const renderTextInput = (questionIndex: number) => {
    return (
      <Form.Group className="m-0 mt-2">
        <Form.Control
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Type here."
        />
      </Form.Group>
    );
  };

  const renderDateInput = (questionIndex: number) => {
    return (
      <Form.Group className="m-0 mt-2">
        <Form.Select
          value={year}
          onChange={(event) => {
            setYear(event.target.value);
          }}
        >
          <option value={0} defaultChecked>
            Select Year
          </option>
          {years?.length &&
            years.map((year: any) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </Form.Select>
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
          value={bio}
          className={styles.height100px}
          onChange={(event) => setBio(event.target.value)}
        ></Form.Control>
      </Form.Group>
    );
  };

  const renderSignUpForm = () => {
    return (
      <Row className="justify-content-center">
        <Col xs="12" className="">
          <Form.Group className="mb-3">
            {/* <Form.Label>Email *</Form.Label> */}
            <Form.Control
              onChange={(e) => firstNameHandler(e.target.value)}
              value={firstName}
              type="text"
              placeholder="First Name"
            />
            <Form.Text className="text-danger">
              {errors.firstNameError}
            </Form.Text>
          </Form.Group>
        </Col>
        <Col xs="12" className="">
          <Form.Group className="mb-3">
            {/* <Form.Label>Email *</Form.Label> */}
            <Form.Control
              onChange={(e) => lastNameHandler(e.target.value)}
              value={lastName}
              type="text"
              placeholder="Last Name"
            />
            <Form.Text className="text-danger">
              {errors.lastNameError}
            </Form.Text>
          </Form.Group>
        </Col>
        <Row className="w-100">
          <Col xs="6" className="ps-0">
            <Form.Group className="mb-3">
              {/* <Form.Label>Password *</Form.Label> */}
              <InputGroup>
                <Form.Control
                  onChange={(e) => passwordHandler(e.target.value)}
                  value={password}
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                />
                <InputGroup.Text id="basic-addon2">
                  <FontAwesomeIcon
                    onClick={() => {
                      setIsPasswordVisible(!isPasswordVisible);
                    }}
                    role={"button"}
                    icon={isPasswordVisible ? faEye : faEyeSlash}
                  />
                </InputGroup.Text>
              </InputGroup>
              <Form.Text className="text-danger">
                {errors.passwordError}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col xs="6" className="p-0">
            <Form.Group className="mb-3">
              {/* <Form.Label>Password *</Form.Label> */}
              <InputGroup>
                <Form.Control
                  onChange={(e) => confirmPasswordHandler(e.target.value)}
                  value={confirmPassword}
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                />
                <InputGroup.Text id="basic-addon2">
                  <FontAwesomeIcon
                    onClick={() => {
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
                    }}
                    role={"button"}
                    icon={isConfirmPasswordVisible ? faEye : faEyeSlash}
                  />
                </InputGroup.Text>
              </InputGroup>
              <Form.Text className="text-danger">
                {errors.confirmPasswordError}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Col xs="12">
          <Form.Group className="mb-3">
            {/* <Form.Label>Email *</Form.Label> */}
            <Form.Control
              onChange={(e) => emailHandler(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
            />
            <Form.Text className="text-danger">{errors.emailError}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            {/* <Form.Label>Country *</Form.Label> */}
            <Form.Select
              value={selectedCountryLocal}
              onChange={(event) => {
                countryHandler(event.target.value);
              }}
            >
              <option selected disabled value={-1}>
                Please select Country
              </option>
              {countries.map((country: CountryModal) => {
                return (
                  <option value={country.id} key={country.id}>
                    {country.name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Text className="text-danger">{errors.countryError}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            {/* <Form.Label>Location *</Form.Label> */}
            <Form.Select
              value={selectedFranchiseLocal}
              onChange={(event) => {
                franchiseHandler(+event.target.value);
              }}
            >
              <option value={-1}>Please select Location</option>
              {localFranchiseList.map((franchise: FranchiseModal) => {
                return (
                  <option value={franchise.id} key={franchise.id}>
                    {franchise.name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Text className="text-danger">
              {errors.franchiseError}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            {/* <Form.Label>Email *</Form.Label> */}
            <Form.Control
              onChange={(e) => addressHandler(e.target.value)}
              value={address}
              type="text"
              placeholder="Address"
            />
            <Form.Text className="text-danger">{errors.addressError}</Form.Text>
          </Form.Group>
          {selectedCountryLocal !== 21 && (
            <Form.Group className="mb-3">
              {/* <Form.Label>Email *</Form.Label> */}
              <Form.Control
                onChange={(e) => cityHandler(e.target.value)}
                value={city}
                type="text"
                placeholder="City"
              />
              <Form.Text className="text-danger">{errors.cityError}</Form.Text>
            </Form.Group>
          )}
          {selectedCountryLocal === 21 && (
            <Form.Group className="mb-3">
              {/* <Form.Label>Email *</Form.Label> */}
              <Form.Control
                onChange={(e) => emirateHandler(e.target.value)}
                value={emirate}
                type="text"
                placeholder="Emirate"
              />
              <Form.Text className="text-danger">
                {errors.emirateError}
              </Form.Text>
            </Form.Group>
          )}
          {(selectedCountryLocal === 1 ||
            selectedCountryLocal === -1 ||
            selectedCountryLocal === 31) && (
            <Form.Group className="mb-3">
              {/* <Form.Label>Email *</Form.Label> */}
              <Form.Control
                onChange={(e) => stateHandler(e.target.value)}
                value={state}
                type="text"
                placeholder="State"
              />
              <Form.Text className="text-danger">{errors.stateError}</Form.Text>
            </Form.Group>
          )}
          {selectedCountryLocal === 11 && (
            <Form.Group className="mb-3">
              {/* <Form.Label>Email *</Form.Label> */}
              <Form.Control
                onChange={(e) => countyHandler(e.target.value)}
                value={county}
                type="text"
                placeholder="County"
              />
              <Form.Text className="text-danger">
                {errors.countyError}
              </Form.Text>
            </Form.Group>
          )}
          {selectedCountryLocal === 1 ||
          selectedCountryLocal === 31 ||
          selectedCountryLocal === -1 ? (
            <Form.Group className="mb-3">
              {/* <Form.Label>Email *</Form.Label> */}
              <Form.Control
                onChange={(e) => zipCodeHandler(e.target.value)}
                value={zipCode}
                type="text"
                placeholder="Zip Code"
              />
              <Form.Text className="text-danger">
                {errors.zipCodeError}
              </Form.Text>
            </Form.Group>
          ) : selectedCountryLocal === 11 ? (
            <Form.Group className="mb-3">
              {/* <Form.Label>Email *</Form.Label> */}
              <Form.Control
                onChange={(e) => postCodeHandler(e.target.value)}
                value={postCode}
                type="text"
                placeholder="Post Code"
              />
              <Form.Text className="text-danger">
                {errors.postCodeError}
              </Form.Text>
            </Form.Group>
          ) : (
            <></>
          )}

          <Form.Group className="mb-3">
            {/* <Form.Label>Email *</Form.Label> */}
            <PhoneInput
              countries={["US", "AE", "GB", "CA"]}
              addInternationalOption={false}
              defaultCountry={
                selectedCountryLocal === 21
                  ? "AE"
                  : selectedCountryLocal === 11
                  ? "GB"
                  : selectedCountryLocal === 31
                  ? "CA"
                  : "US"
              }
              placeholder="Enter Phone Number"
              limitMaxLength={true}
              value={phone}
              onChange={(number: string) => {
                phoneHandler(number);
              }}
            />
            {/* <Form.Control
              onChange={(e) => phoneHandler(e.target.value)}
              value={phone}
              type="text"
              placeholder="Phone"
            /> */}
            <Form.Text className="text-danger">{errors.phoneError}</Form.Text>
          </Form.Group>
        </Col>
        <Row className="w-100">
          <Col xs="12" className="">
            <Form.Group className="mb-3 d-flex justify-content-between">
              <Form.Label>Gender (Optional)</Form.Label>
              <Form.Check
                type={"radio"}
                label="Male"
                value={"male"}
                onChange={(e) => genderHandler(e.target.value)}
                name="gender"
              />
              <Form.Check
                type={"radio"}
                label="Female"
                value={"female"}
                onChange={(e) => genderHandler(e.target.value)}
                name="gender"
                // label={`disabled ${type}`}
                // id={`disabled-default-${type}`}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="w-100">
          <Col xs="6" className="ps-0">
            <Form.Group className="mb-3">
              <Form.Label>Date Of Birth</Form.Label>
              <Form.Control
                onChange={(e) => dobHandler(e.target.value)}
                value={moment(dob).format("YYYY-MM-DD")}
                type="date"
                placeholder="Date of Birth (mm/dd/yy)"
              />
              <Form.Text className="text-danger">{errors.dobError}</Form.Text>
            </Form.Group>
          </Col>
          {selectedCountryLocal === 1 && (
            <Col xs="6" className="pe-0">
              <Form.Group className="mb-3">
                {/* <Form.Label>Email *</Form.Label> */}
                <Form.Control
                  onChange={(e) => SSNHandler(e.target.value)}
                  value={SSN}
                  type="text"
                  placeholder="Last 4 of SSN"
                />
                <Form.Text className="text-danger">{errors.SSNError}</Form.Text>
              </Form.Group>
            </Col>
          )}
        </Row>
      </Row>
    );
  };

  const renderSignUpActions = () => {
    return (
      <Row className="justify-content-center pb-4">
        <Col xs="12">
          <div className="d-flex">
            <Form.Check
              aria-label="radio 1"
              onChange={(e) => setIsSignUpChecked(!isSignUpChecked)}
            />
            <p className="ms-2">
              By signing up, you agree to our
              
              <span className="color-primary">
                <a className="color-primary" style={{textDecoration:"none"}} 
                  href='https://web.sendmeapro.com/TAC' rel="noreferrer" target="_blank"> 
                  {" Terms & Condition "}  
                </a> 
                 and  
                <a className="color-primary" style={{textDecoration:"none"}} 
                  href='https://web.sendmeapro.com/PP' rel="noreferrer" target="_blank">
                   {" Privacy Policy "}
                </a>
              </span>
            </p>
          </div>
          {/* <p
            onClick={toggleForgotPasswordModal}
            className="text-start forgot-password p-0 mb-2 cursor-pointer text-primary"
          >
            Forgot Password
          </p>
          <div className="w-100 text-center">
            <button
              type="button"
              className="btn background-primary border-color-primary rounded-4 text-light input-label w-50"
              onClick={handleManualSignIn}
            >
              Login
            </button>
          </div>
          <p className="mt-2 already-account text-start">
            Don't have an account?
          </p> */}
          <div className="w-100 text-center">
            <button
              type="button"
              disabled={!isSignUpChecked}
              onClick={handleSignUp}
              className="btn background-light border-color-primary rounded-4 color-primary input-label w-50"
            >
              Sign Up
            </button>
          </div>
        </Col>
      </Row>
    );
  };

  if (isVerificationOpen) {
    return (
      <div className={styles.image} style={{ height: "calc(100vh)" }}>
        <div className="w-100 p-5">
          <Container className="mt-5 card w-25 p-0 flex-column">
            <Row
              className={`${
                formIndex === 0 ? `` : ""
              } card-header p-0 bg-white border-0 w-100 m-3`}
            >
              <Col xs="12" className="mb-3 ps-3">
                <Image
                  src={LOGO}
                  alt="Send me a Trainer"
                  className="smat-brand-logo"
                  width={205}
                />
                <FontAwesomeIcon
                  style={{ fontSize: "12px", position: "absolute", top: "10" }}
                  role={"button"}
                  icon={faRegistered}
                />
              </Col>
              <div className="loading-bar">
                <div className={`short-line`}></div>
              </div>
            </Row>
            <Row className="card-body p-3 pt-0 w-100">
              <Col
                xxl="12"
                xl="12"
                lg="12"
                md="12"
                sm="12"
                xs="12"
                className="d-flex flex-column align-items-center pb-5"
              >
                <Col xs="12" className="">
                  <Row>
                    <Col xs="12" className="pt-1"></Col>
                  </Row>
                  <Row>
                    <Col
                      xs="12"
                      className="d-flex justify-content-center align-tems-center flex-column"
                    >
                      <p className="fs-5 text-center fw-bolder">
                        Verify your email
                      </p>
                      <FontAwesomeIcon
                        icon={faEnvelopeOpenText}
                        className="mb-3 h1"
                      />
                      <p>
                        Please verify your email account by clicking the link
                        sent to your email address.
                      </p>
                      <div className="text-center">
                        <Button
                          variant="primary"
                          className="background-primary border-color-primary font-family-poppins text-light w-100 fs-6 form-control"
                          onClick={() => setIsVerificationOpen(false)}
                        >
                          Email Verified, Click here to Login
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Col>
              {isLoading && (
                <div className="overlay">
                  <Spinner animation="grow" variant="info" />
                </div>
              )}
            </Row>
          </Container>
        </div>
      </div>
    );
  }

  if (formIndex > 4 && success) {
    return (
      <div className={styles.image} style={{ height: "calc(100vh)" }}>
        <div className="w-100 p-5">
          <Container className="mt-5 card w-sm p-0 flex-column">
            <Row
              className={`${
                formIndex === 0 ? `` : ""
              } card-header p-0 bg-white border-0 w-100 m-3`}
            >
              <Col xs="12" className="mb-3 ps-3">
                <Image
                  src={LOGO}
                  alt="Send me a Trainer"
                  className="smat-brand-logo"
                  width={205}
                />
                <FontAwesomeIcon
                  style={{ fontSize: "12px", position: "absolute", top: "10" }}
                  role={"button"}
                  icon={faRegistered}
                />
              </Col>
              <div className="loading-bar">
                <div className={`short-line`}></div>
              </div>
            </Row>
            <Row className="card-body w-100">
              <div
                className={`${styles.contentWrapper}`}
                style={{ width: "100%" }}
              >
                <div style={{ flexDirection: "row" }}>
                  <p className="text-center text-dark fw-bold">Thank You!</p>
                  <p className="text-center text-dark">
                    For completing your profile
                  </p>
                  <p className="text-center text-dark">
                    You will be receiving an email with a link to submit your
                    documents to verify your account
                  </p>
                  <p className="text-center text-dark">
                    A member of our support team will also be in touch with you
                    to schedule your interview
                  </p>
                  <button
                    className="border-color-primary form-control background-primary text-light"
                    onClick={() => navigate("/provider-sign-in")}
                  >
                    {" "}
                    OK{" "}
                  </button>
                </div>
              </div>
            </Row>
          </Container>
        </div>
      </div>
    );
  } else if (formIndex > 4 && !success) {
    return (
      <div className="image" style={{ height: "100%" }}>
        <div className="w-100 p-5">
          <Container className="mt-5 card p-0 w-sm flex-column">
            <Row className="card-header p-0 bg-white border-0 w-100 m-3">
              <Col xs="12" className="mb-3 ps-3">
                <Image
                  src={LOGO}
                  alt="Send me a Trainer"
                  className="smat-brand-logo"
                  width={"40%"}
                />
                <FontAwesomeIcon
                  style={{ fontSize: "12px", position: "absolute", top: "10" }}
                  role={"button"}
                  icon={faRegistered}
                />
              </Col>
              <div className="loading-bar">
                <div className="short-line"></div>
              </div>
            </Row>
            <Row className="card-body p-0 w-100">
              <Col xs="12" className="">
                <Row>
                  <Col xs="12" className="pt-1">
                    <p className="fs-5 text-start fw-bolder">Create Account</p>
                  </Col>
                </Row>
                {renderSignUpForm()}
                {renderSignUpActions()}
              </Col>
            </Row>
            {isLoading && (
              <div className="overlay">
                <Spinner animation="grow" variant="info" />
              </div>
            )}
          </Container>
        </div>
      </div>
    );
  }

  if (forms?.length && trainerCategories?.length) {
    return (
      <div style={{ height: "calc(100vh)" }}>
        <div className="w-100 p-5">
          <Container className={`mt-5 card ${styles.wsm} p-0 flex-column`}>
            <Row
              className={`${
                formIndex === 0 ? `` : ""
              } card-header p-0 bg-white border-0 w-100 m-3`}
            >
              <Col
                xs="1"
                className="mb-3 p-0 d-flex justify-content-center align-items-center"
              >
                {formIndex === 0 ? (
                  <Nav.Link href={"/provider-sign-in"}>
                    <FontAwesomeIcon
                      className="color-primary fs-4"
                      role={"button"}
                      icon={faAngleLeft}
                    />
                  </Nav.Link>
                ) : (
                  <span onClick={() => setFormIndex(formIndex - 1)}>
                    <FontAwesomeIcon
                      className="color-primary fs-4"
                      role={"button"}
                      icon={faAngleLeft}
                    />
                  </span>
                )}
              </Col>
              <Col xs="11" className="mb-3 p-0">
                <Image
                  src={LOGO}
                  alt="Send me a Trainer"
                  className="smat-brand-logo"
                  width={"40%"}
                />
                <FontAwesomeIcon
                  style={{ fontSize: "12px", position: "absolute", top: "10" }}
                  role={"button"}
                  icon={faRegistered}
                />
              </Col>
              <div className="loading-bar">
                <div className={`short-line-${formIndex}`}></div>
              </div>
            </Row>
            <Row className="card-body w-100">
              <div
                className={`${styles.contentWrapper}`}
                style={{ width: "100%" }}
              >
                <div style={{ flexDirection: "row" }}>
                  {/* <ProgressBar
                variant="info"
                now={
                  formIndex !== 0 ? (100 / forms?.length) * (formIndex + 1) : 15
                }
              /> */}
                  <p
                    className={`
                  ${styles.nameText}
                  w-100
                  mt-2
                  mb-0
                  text-start
                `}
                  >
                    {forms[formIndex]?.name}
                  </p>
                  <p
                    className={`w-100 mt-1 text-start ${styles.descriptionText} `}
                  >
                    {forms[formIndex]?.describe}
                  </p>
                </div>
                {forms[formIndex]?.questions?.map(
                  (question: any, index: number) => {
                    return (
                      <>
                        <div
                          key={index}
                          style={{
                            width: "100%",
                            marginTop: "10px",
                            marginBottom: "20px",
                          }}
                        >
                          {(question.type === "SCQ" ||
                            question.type === "MCQ" ||
                            question.type === "Availability") &&
                          forms[formIndex]?.questions.length === 1 ? null : (
                            <span style={{ color: "black" }}>
                              {question.name}
                              {question.name && (
                                <span style={{ color: "red" }}>*</span>
                              )}
                              {/* {question.isRequired ? " *" : ""} */}
                            </span>
                          )}
                          {question.type === "MCQ"
                            ? renderSearchCollapseList(question, index)
                            : question.type === "SCQ"
                            ? renderSearchCollapseList(question, index)
                            : question.type === "Text"
                            ? renderTextInput(index)
                            : question.type === "Search"
                            ? renderSearchTextInput(
                                index,
                                question?.placeholder
                              )
                            : question.type === "Date"
                            ? renderDateInput(index)
                            : question.type === "Textarea"
                            ? renderTextarea(question.placeholder, index)
                            : null}
                        </div>
                      </>
                    );
                  }
                )}
              </div>
              {renderFooter()}
              {isLoading && (
                <div className="overlay">
                  <Spinner animation="grow" variant="info" />
                </div>
              )}
            </Row>
          </Container>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ height: "calc(100vh)" }}>
        <div className="overlay">
          <Spinner animation="grow" variant="info" />
        </div>
      </div>
    );
  }
};

export { ProviderSignUp };
