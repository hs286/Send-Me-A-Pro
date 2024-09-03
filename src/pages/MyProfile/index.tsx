import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Image,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useUploadImage } from "../../hooks";
import {
  AppDispatch,
  CityModal,
  CountryModal,
  getCitiesAction,
  getStatesAction,
  StateModal,
  UpdateProfileModal,
  updateUserProfileAction,
} from "../../redux";
import { SET_USER } from "../../redux/types";
import "./style.css";

const MyProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: any) => state.user);
  const { countries, states, cities } = useSelector((state: any) => state.auth);
  const { uploadImage, loadingSelecting } = useUploadImage();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [gender, setGender] = useState<string>("-1");
  const [zipcode, setZipcode] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [state, setState] = useState<string>("-1");
  const [city, setCity] = useState<string>("-1");
  const [country, setCountry] = useState<string>("-1");
  const [franchise, setFranchise] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({
    firstNameError: "",
    lastNameError: "",
    dobError: "",
    genderError: "",
    cityError: "",
    stateError: "",
    countryError: "",
    phoneError: "",
  });

  useEffect(() => {
    if (profile) {
      setFirstName(profile?.firstname || "");
      setLastName(profile?.lastname || "");
      setEmail(profile?.email || "");
      setDob(profile?.dob || "");
      setGender(profile?.gender === "male" ? "1" : "2");
      setZipcode(profile?.zipcode || "");
      setAvatar(profile?.avatar || "");
      setState(profile?.state_id || "-1");
      setCountry(profile?.Country?.id || "-1");
      setCity(profile?.city_id || "-1");
      setPhone(String(profile?.phone || "").replace(/-/g, "") || "");
      if (profile?.Franchise && profile?.Franchise.length > 0) {
        let _franchise: any = profile?.Franchise.map((_f: any) => {
          return {
            franchise_id: _f.franchise_id,
            active: _f.active,
            franchise_name: _f?._Franchise?.name,
          };
        });
        if (_franchise?.length) {
          setFranchise(_franchise[0]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const validate = () => {
    let hasError = false;
    let _errors = {
      firstNameError: "",
      lastNameError: "",
      dobError: "",
      genderError: "",
      cityError: "",
      stateError: "",
      countryError: "",
      phoneError: "",
    };
    if (firstName?.length === 0) {
      hasError = true;
      _errors = {
        ..._errors,
        firstNameError: "Field cannot be empty",
      };
    }
    if (lastName?.length === 0) {
      hasError = true;
      _errors = {
        ..._errors,
        lastNameError: "Field cannot be empty",
      };
    }
    if (dob === "") {
      hasError = true;
      _errors = {
        ..._errors,
        dobError: "Field cannot be empty",
      };
    }
    if (gender === "-1") {
      hasError = true;
      _errors = {
        ..._errors,
        genderError: "Field cannot be empty",
      };
    }
    if (country === "-1") {
      hasError = true;
      _errors = {
        ..._errors,
        countryError: "Please select country",
      };
    }
    if (state === "-1") {
      hasError = true;
      _errors = {
        ..._errors,
        stateError: "Please select state",
      };
    }

    if (city === "-1") {
      hasError = true;
      _errors = {
        ..._errors,
        cityError: "Please select city",
      };
    }

    if (phone?.trim() === "") {
      hasError = true;
      _errors = {
        ..._errors,
        phoneError: "Field cannot be empty",
      };
    }

    if (phone?.trim()?.length < 8) {
      hasError = true;
      _errors = {
        ..._errors,
        phoneError: "Please enter a valid phone number",
      };
    }

    setErrors(_errors);
    return !hasError;
  };

  useEffect(() => {
    if (country !== "-1") {
      dispatch(getStatesAction(parseInt(country)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  useEffect(() => {
    if (state !== "-1" && country !== "-1") {
      dispatch(getCitiesAction(parseInt(country), parseInt(state)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, country]);

  const updateUserProfileInStore = useCallback(async (updatedProfile: any) => {
    const userProfileFromLocalStorage = await localStorage.getItem(
      "userProfile"
    );
    if (userProfileFromLocalStorage) {
      const _userProfile = JSON.parse(userProfileFromLocalStorage);
      let _updatedProfile = { ..._userProfile, ...updatedProfile };
      dispatch({ type: SET_USER, payload: _updatedProfile });
      localStorage.setItem("userProfile", JSON.stringify(_updatedProfile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (validate()) {
      let updatedProfile: UpdateProfileModal = {
        firstname: firstName,
        lastname: lastName,
        zipcode: zipcode,
        dob: moment(dob).format("YYYY-MM-DD"),
        gender: gender === "1" ? "male" : "female",
        phone,
        country_id: parseInt(country),
        state_id: parseInt(state),
        city_id: parseInt(city),
        franchise: profile?.Franchise?.map((_f: any) => {
          return { franchise_id: _f.franchise_id, active: _f.active };
        }),
        status: true,
      };
      setIsLoading(true);
      dispatch(
        updateUserProfileAction(
          profile?.id,
          updatedProfile,
          (data: any) => {
            updateUserProfileInStore(data);
            toast.success("Profile updated successfully !", {
              autoClose: 3000,
            });
            setIsLoading(false);
          },
          () => {
            setIsLoading(false);
          }
        )
      );
    }
  };

  return (
    <>
      <Container className="min-height-vh-75">
        <Row className="justify-content-center">
          <Col lg="3" xs="12" className="d-flex flex-column align-items-center">
            {loadingSelecting ? (
              <Spinner className="mt-5" variant="info" animation="grow" />
            ) : (
              <>
                <Image
                  src={avatar}
                  className="img-rounded profile-avatar-img mt-5"
                />
                <input
                  onChange={(event: any) => {
                    uploadImage(
                      event.target.files[0],
                      async (data: any) => {
                        const userProfileFromLocalStorage =
                          await localStorage.getItem("userProfile");
                        if (userProfileFromLocalStorage) {
                          const _userProfile = JSON.parse(
                            userProfileFromLocalStorage
                          );
                          if (data?.avatar) {
                            let _updatedProfile = {
                              ..._userProfile,
                              avatar: data?.avatar,
                            };
                            dispatch({
                              type: SET_USER,
                              payload: _updatedProfile,
                            });
                            localStorage.setItem(
                              "userProfile",
                              JSON.stringify(_updatedProfile)
                            );
                          }
                        }
                      },
                      (error: any) => {
                        toast.error("Something went wrong !");
                        console.error(error);
                      }
                    );
                  }}
                  type={"file"}
                  accept="image/*"
                  className="border d-none mt-1 mb-2"
                  id="product_image_uploader"
                />
                <Button
                  onClick={() => {
                    let imageUploader = document.getElementById(
                      "product_image_uploader"
                    );
                    if (imageUploader) {
                      imageUploader.click();
                    }
                  }}
                  className="no-background no-border color-primary mt-2"
                >
                  Change Avatar
                </Button>
              </>
            )}
          </Col>
          <Col lg="6" xs="12">
            <Row className="mt-5">
              <Col md="6">
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    value={firstName}
                    onChange={(event) => {
                      setErrors({ ...errors, firstNameError: "" });
                      setFirstName(event.target.value);
                    }}
                    type="text"
                    placeholder="Enter First Name"
                  />
                  <Form.Text className="text-muted">
                    {errors?.firstNameError}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md="6">
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    value={lastName}
                    onChange={(event) => {
                      setErrors({ ...errors, lastNameError: "" });
                      setLastName(event.target.value);
                    }}
                    type="text"
                    placeholder="Enter Last Name"
                  />
                  <Form.Text className="text-muted">
                    {errors?.lastNameError}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={Email}
                    placeholder="Enter Email"
                    disabled
                  />
                  {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
                </Form.Group>
              </Col>

              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>Date of birth</Form.Label>
                  <Form.Control
                    value={moment(dob).format("YYYY-MM-DD")}
                    onChange={(event) => {
                      setErrors({ ...errors, dobError: "" });
                      setDob(moment(event.target.value).format());
                    }}
                    type="date"
                  />
                  <Form.Text className="text-muted">
                    {errors?.dobError}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={gender}
                    onChange={(event) => {
                      setErrors({ ...errors, genderError: "" });
                      setGender(event.target.value);
                    }}
                    aria-label="Default select example"
                  >
                    <option value={"-1"} disabled>
                      Select Gender
                    </option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    {errors?.genderError}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    value={country}
                    onChange={undefined}
                    disabled
                    aria-label="Default select example"
                  >
                    <option disabled value={"-1"}>
                      Select Country
                    </option>
                    {countries?.map((country: CountryModal) => {
                      return (
                        <option key={country?.id} value={country?.id}>
                          {country?.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
                </Form.Group>
              </Col>

              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    value={state}
                    onChange={(event) => {
                      setErrors({ ...errors, stateError: "" });
                      setState(event.target.value);
                      setCity("-1");
                    }}
                    aria-label="Default select example"
                  >
                    <option disabled value={"-1"}>
                      Select State
                    </option>
                    {states?.map((state: StateModal) => {
                      return (
                        <option key={state?.id} value={state?.id}>
                          {state?.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    {errors?.stateError}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Select
                    onChange={(event) => {
                      setCity(event.target.value);
                      setErrors({ ...errors, cityError: "" });
                    }}
                    value={city}
                    aria-label="Default select example"
                  >
                    <option value={"-1"}>Select City</option>
                    {cities?.map((city: CityModal) => {
                      return (
                        <option key={city?.id} value={city?.id}>
                          {city?.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    {errors?.cityError}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>Location Name</Form.Label>
                  <Form.Control
                    value={franchise?.franchise_name}
                    type="text"
                    disabled
                  />
                  {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
                </Form.Group>
              </Col>

              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>Zipcode</Form.Label>
                  <Form.Control
                    onChange={(event) => setZipcode(event.target.value)}
                    value={zipcode}
                    type="text"
                  />
                  {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
                </Form.Group>
              </Col>

              <Col xs="12">
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    onChange={(event) => {
                      setPhone(event.target.value);
                      setErrors({ ...errors, phoneError: "" });
                    }}
                    value={phone}
                    type="text"
                  />
                  <Form.Text className="text-muted">
                    {errors?.phoneError}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs="12">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="border-color-primary background-primary w-100"
                >
                  {isLoading ? (
                    <Spinner variant="light" size="sm" animation="border" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export { MyProfile };
