import React, { useCallback, useEffect } from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./redux/store";
import { useNavigate } from "react-router-dom";
// import { gapi } from "gapi-script";
import { hotjar } from "react-hotjar";

import {
  SET_SELECTED_COUNTRY,
  SET_SELECTED_FRANCHISE,
  SET_USER,
} from "./redux/types";
import {
  getAllFranchisesAction,
  getCountriesAction,
  setBroadcastRequestIsVisibleAction,
} from "./redux";
import { Col, Row, Spinner } from "react-bootstrap";
import { AppRoutes } from "./AppRoutes";
import { ToastContainer } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-phone-number-input/style.css";
import { connectToSocket } from "./socket/initialSocket";
import { BroadcastRequestModal } from "./components";
import { BankDetailsModal } from "./components/BankDetailsModal";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isBankDetailModalOpen, setIsBankDetailModalOpen] =
    React.useState(false);

  // const clientId =
  //   "413867310132-s4e9depk2l56gg6fshlul96nvcqr27da.apps.googleusercontent.com";

  const { profile } = useSelector((state: any) => state.user);

  const { isFullScreenLoaderVisible } = useSelector(
    (state: any) => state.loader
  );

  const { isBroadcastRequestModalVisible } = useSelector(
    (state: any) => state.broadcastRequestReducer
  );

  hotjar?.initialize(3385170, 6);

  // useEffect(() => {
  //   const initClient = () => {
  //     gapi?.client?.init({
  //       clientId: clientId,
  //       scope: "profile",
  //     });
  //   };
  //   gapi.load("client:auth2", initClient);
  // });

  const fetchInitialData = useCallback(async () => {
    const userProfileFromLocalStorage = await localStorage.getItem(
      "userProfile"
    );
    if (userProfileFromLocalStorage) {
      const _userProfile = JSON.parse(userProfileFromLocalStorage);
      const franchiseLocal = _userProfile?.Franchise?.[0]._Franchise || {};
      const _country = _userProfile?.Country || {};
      dispatch({ type: SET_USER, payload: _userProfile });
      dispatch({ type: SET_SELECTED_FRANCHISE, payload: franchiseLocal });
      dispatch({ type: SET_SELECTED_COUNTRY, payload: _country });
      if (
        franchiseLocal &&
        !window.location.pathname.includes("/all") &&
        !(
          window.location.pathname.includes("/FAQ") ||
          window.location.pathname.includes("/PP") ||
          window.location.pathname.includes("/TAC") ||
          window.location.pathname.includes("/messages") ||
          window.location.pathname.includes("/current-location") ||
          window.location.pathname.includes("/live-location") ||
          window.location.pathname.includes("/sessions") ||
          window.location.pathname.includes("/packages") ||
          window.location.pathname.includes("/stats") ||
          window.location.pathname.includes("/my-profile") ||
          window.location.pathname.includes("/provider-profile") ||
          window.location.pathname.includes("/change-password") ||
          window.location.pathname.includes("/payment-history") ||
          window.location.pathname.includes("/manage-pros")
        )
      ) {
        navigate(`/${franchiseLocal?.domain}/all`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    connectToSocket((newMessage: any) => {
      if (newMessage && newMessage.data) {
        console.log(newMessage, "new msg in listen in component did mount");
      }
    });
  }, []);

  const fetchInitialDataFromApi = useCallback(async () => {
    dispatch(getCountriesAction());
    dispatch(getAllFranchisesAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchInitialDataFromApi();
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const roles =
      profile?.roles?.length &&
      profile?.roles?.find((item: any) => item.slug === "trainer");
    if (profile && profile?.bank_token !== null && roles?.id) {
      setIsBankDetailModalOpen(false);
    } else if (profile && profile?.bank_token === null && roles?.id) {
      setIsBankDetailModalOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.bank_token, profile?.roles]);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
      <BankDetailsModal
        isOpen={isBankDetailModalOpen}
        setIsBankDetailModalOpen={setIsBankDetailModalOpen}
      />
      <BroadcastRequestModal
        isOpen={isBroadcastRequestModalVisible}
        title={
          <Row className="justify-content-center w-100">
            <Col xs="12" sm="8" lg="5">
              <h3>Request new pro</h3>
            </Col>
          </Row>
        }
        onHide={() => {
          dispatch(setBroadcastRequestIsVisibleAction(false));
        }}
      />
      {isFullScreenLoaderVisible && (
        <div className="overlay">
          <Spinner animation="grow" variant="info" />
        </div>
      )}
    </>
  );
}

export default App;
