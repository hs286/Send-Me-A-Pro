import React, { useEffect, useState } from "react";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Image,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LOGO } from "../../assets/images";
import {
  AppDispatch,
  CountryModal,
  getTrainersAction,
  resetFiltersAction,
  setBroadcastRequestIsVisibleAction,
  toggleFranchiseModalStateAction,
} from "../../redux";
import { SET_IS_LOGGED_IN, SET_USER } from "../../redux/types";
import { ChangeFranchiseModal } from "../ChangeFranchiseModal";
import "./style.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  let tokenFromLocalStorage = localStorage.getItem("provider");

  const { selectedFranchise, profile } = useSelector(
    (state: any) => state.user
  );

  const showBroadcastRequestModal = () => {
    dispatch(setBroadcastRequestIsVisibleAction(true));
  };

  const { countries } = useSelector((state: any) => state.auth);
  const [shouldCallOnSuccess, setShouldCallOnSuccess] =
    useState<boolean>(false);
  const [selectedCountryLocal, setSelectedCountryLocal] = useState<
    CountryModal | {}
  >({
    id: 0,
    capital: "",
    created_at: "",
    curency_symbol: "",
    currency: "",
    iso: "",
    name: "",
    phone: "",
    updated_at: "",
  });

  const [franchiseName, setFranchiseName] = useState<string>("");

  const handleFranchiseModalToggle = (payload: boolean) => {
    dispatch(toggleFranchiseModalStateAction(payload));
  };

  const handleNavigateToFaq = (type: string) => {
    let url = type;
    if (selectedFranchise?.name) {
      url = `${selectedFranchise?.domain}/${type}`;
    }
    window.open(`${window.location.origin}/${url}`);
  };

  const getCountryCode = () => {
    const _country: CountryModal = countries.find(
      (country: CountryModal) =>
        country.id === selectedFranchise?.user?.country_id
    );
    if (_country) {
      if (_country.iso === "GB") {
        return "+44";
      } else if (_country.iso === "US") {
        return "+1";
      } else if (_country.iso === "AE") {
        return "+971";
      }
    } else {
      return "+1";
    }
  };

  const getPhoneNumber = () => {
    const _phone = selectedFranchise?.user?.phone || "";
    if (_phone) {
      return `${getCountryCode()} ${_phone}`;
    } else {
      return "";
    }
  };

  const getFranchiseName = (name: string) => {
    let franchiseName = name.split("(")[0];
    if (franchiseName) {
      let temp = franchiseName.split("-");
      if (temp.length > 1) {
        franchiseName = temp[1]?.trim();
        return franchiseName;
      }
    }
    return name;
  };

  const handleLogoClick = () => {
    if (window.location.pathname.includes("all") && selectedFranchise?.name) {
      navigate(`${selectedFranchise?.domain}/all`);
      dispatch(resetFiltersAction());
      dispatch(
        getTrainersAction({
          franchise_id: selectedFranchise?.id,
          filtersData: {
            categories: [],
            specialities: [],
            languages: [],
            certificates: [],
          },
          page: 1,
        })
      );
    } else if (
      window.location.pathname === "" ||
      window.location.pathname === "/"
    ) {
      navigate("/");
      dispatch(resetFiltersAction());
      dispatch(
        getTrainersAction({
          franchise_id: selectedFranchise?.id,
          filtersData: {
            categories: [],
            specialities: [],
            languages: [],
            certificates: [],
          },
          page: 1,
        })
      );
    } else {
      navigate(`${selectedFranchise?.domain}/all`);
    }
  };

  const handleLogout = () => {
    dispatch({ type: SET_IS_LOGGED_IN, payload: false });
    dispatch({ type: SET_USER, payload: {} });
    localStorage.removeItem("userProfile");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("isTemp");
    localStorage.removeItem("provider");
    toast("Signed Out Successfully !");
    navigate("/");
  };

  useEffect(() => {
    if (selectedFranchise?.name) {
      setFranchiseName(getFranchiseName(selectedFranchise?.name));
    }
  }, [selectedFranchise]);

  const renderProfileAvatar = () => {
    return (
      <div className="smat-user-avatar">
        <span className="text-black me-2 header-avatar-name">
          {profile?.firstname + " " + profile?.lastname}
        </span>
        <Image src={profile?.avatar} className="border-color-primary" />
      </div>
    );
  };

  const handleSelectFranchiseModalOpen = () => {
    handleFranchiseModalToggle(true);
    setShouldCallOnSuccess(true);
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg">
        <Container>
          <Navbar.Brand onClick={handleLogoClick}>
            <Image
              src={LOGO}
              alt="Send me a Trainer"
              className="smat-brand-logo"
              width={205}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"></Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <Button
                onClick={() => handleNavigateToFaq("FAQ")}
                className="background-primary border-color-primary btn-sm w-25 color-white ps-3 pe-3 me-3 mt-2 d-lg-none"
              >
                FAQ
              </Button>
              <Nav.Link as={NavLink} to="/all">
                Pros
              </Nav.Link>
              <Nav.Link
                className="no-border no-background black-color text-start"
                as={Button}
                onClick={() =>
                  selectedFranchise?.id
                    ? navigate(
                        selectedFranchise?.id
                          ? "/" + selectedFranchise?.domain + "/packages"
                          : "/"
                      )
                    : handleSelectFranchiseModalOpen()
                }
              >
                Prices
              </Nav.Link>
              {profile?.id ? (
                <>
                  <Nav.Link as={NavLink} to="/sessions">
                    Sessions
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/messages">
                    Messages
                  </Nav.Link>
                  <Nav.Link as={NavLink} to={"/my-program"}>
                    My Program
                  </Nav.Link>
                  <Nav.Link as={NavLink} to={"/payment-history"}>
                    Payment History
                  </Nav.Link>
                  <Nav.Link
                    to={"#"}
                    as={NavLink}
                    onClick={showBroadcastRequestModal}
                  >
                    Broadcast Request
                  </Nav.Link>
                </>
              ) : null}
            </Nav>
          </Navbar.Collapse>
          {/* <Nav className="nav-app-links">
          <Nav.Link
            href="https://apps.apple.com/in/app/send-me-a-pro/id6444440266"
            target={"_blank"}
          >
            <Image
              src={AVAILABLE_ON_APP_STORE}
              alt="Send me a Trainer"
              width={"100px"}
            />
          </Nav.Link>
          <Nav.Link
            href="https://play.google.com/store/apps/details?id=com.smap.user"
            target={"_blank"}
            className="ms-2"
          >
            <Image
              src={AVAILABLE_ON_PLAY_STORE}
              alt="Send me a Trainer"
              width={"100px"}
            />
          </Nav.Link>
        </Nav> */}
          <Nav className="align-items-center nav-location-phone-avatar">
            <Button
              onClick={() => handleNavigateToFaq("FAQ")}
              className="background-primary border-color-primary btn-sm color-white ps-3 pe-3 me-3"
            >
              FAQ
            </Button>
            <Nav.Link href="#deets">
              <span
                role="button"
                onClick={() => handleFranchiseModalToggle(true)}
                className="location-name font-14"
              >
                {franchiseName ? franchiseName : "All Location"}
              </span>
              <FontAwesomeIcon icon={faLocationDot} className="ms-2" />
              <span
                role="button"
                onClick={() => handleFranchiseModalToggle(true)}
                className="change-location text-decoration-underline font-14 ms-2 border-end pe-3"
              >
                Change Location
              </span>
            </Nav.Link>
            <Nav.Link href={"tel:" + getPhoneNumber()}>
              {getPhoneNumber() && (
                <span className="font-14 pointer border-end pe-3">
                  {getPhoneNumber()}
                </span>
              )}
            </Nav.Link>
            {profile?.id ? (
              <NavDropdown
                title={renderProfileAvatar()}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item>
                  <Link className="nav-link-item" to="/my-profile">
                    My Profile
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link className="nav-link-item" to="/change-password">
                    Change Password
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link className="nav-link-item" to="/manage-pros">
                    Manage Pros
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleLogout()}>
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : null}
          </Nav>
        </Container>
      </Navbar>
      <Navbar>
        <Container
          fluid
          className="justify-content-center background-secondary"
        >
          <Nav className="nav-menus-items">
            {!tokenFromLocalStorage && (
              <>
                <Nav.Link
                  as={NavLink}
                  to={
                    selectedFranchise?.id
                      ? "/" + selectedFranchise?.domain + "/all"
                      : "/"
                  }
                >
                  <span className="border-end pe-4 ps-2">Pros</span>
                </Nav.Link>
                <Nav.Link
                  as={Button}
                  className="no-border no-background black-color"
                  onClick={() =>
                    selectedFranchise?.id
                      ? navigate(
                          selectedFranchise?.id
                            ? "/" + selectedFranchise?.domain + "/packages"
                            : "/"
                        )
                      : handleSelectFranchiseModalOpen()
                  }
                >
                  <span className="border-end pe-4 ps-2">Prices</span>
                </Nav.Link>
              </>
            )}
            {profile?.id && !tokenFromLocalStorage ? (
              <>
                <Nav.Link as={NavLink} to={"/sessions"}>
                  <span className="border-end pe-4 ps-2">Sessions</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to={"/messages"}>
                  <span className="border-end pe-4 ps-2">Messages</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to={"/my-program"}>
                  <span className="border-end pe-4 ps-2">My Program</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to={"/payment-history"}>
                  <span className="border-end pe-4 ps-2">Payment History</span>
                </Nav.Link>
                <Nav.Link
                  to={"#"}
                  as={NavLink}
                  onClick={showBroadcastRequestModal}
                  className="pe-4 ps-2"
                >
                  Broadcast Request
                </Nav.Link>
              </>
            ) : !tokenFromLocalStorage ? (
              <>
                {" "}
                <Nav.Link as={NavLink} to={"/sign-up"}>
                  <span className="border-end pe-4 ps-2">Sign Up</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to={"/sign-in"}>
                  <span className="pe-4 ps-2">Sign In</span>
                </Nav.Link>
              </>
            ) : (
              <></>
            )}
          </Nav>

          <Nav className="align-items-center nav-location-phone-avatar-second">
            <Nav.Link href="#deets">
              <span
                role="button"
                onClick={() => {
                  handleFranchiseModalToggle(true);
                  setShouldCallOnSuccess(false);
                }}
                className="location-name font-14 "
              >
                {selectedFranchise?.name
                  ? getFranchiseName(selectedFranchise?.name)
                  : "All Location"}
              </span>
              <FontAwesomeIcon icon={faLocationDot} className="ms-2" />
              <span
                role="button"
                onClick={() => {
                  handleFranchiseModalToggle(true);
                  setShouldCallOnSuccess(false);
                }}
                className="change-location text-decoration-underline font-14  ms-3"
              >
                Change Location
              </span>
            </Nav.Link>
            {profile?.id ? (
              <NavDropdown
                title={renderProfileAvatar()}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item>
                  <Link className="nav-link-item" to="/my-profile">
                    My Profile
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link className="nav-link-item" to="/change-password">
                    Change Password
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link className="nav-link-item" to="/manage-pros">
                    Manage Pros
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleLogout()}>
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                {" "}
                <Nav.Link href={"/sign-up"}>
                  <span className="border-start pe-2 ps-2 ">SignUp</span>
                </Nav.Link>
                <Nav.Link href={"/sign-in"}>
                  <span className="border-start pe-2 ps-2">SignIn</span>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Container>
        <ChangeFranchiseModal
          selectedCountryProp={selectedCountryLocal}
          shouldCallOnSuccess={shouldCallOnSuccess}
          setShouldCallOnSuccess={setShouldCallOnSuccess}
          setSelectedCountryProp={(data: {}) => setSelectedCountryLocal(data)}
        />
      </Navbar>
    </>
  );
};

export { Header };
