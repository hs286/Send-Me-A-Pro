import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppDispatch,
  CountryModal,
  FranchiseModal,
  getFilterOptionsAction,
  getTrainersAction,
  setCategoryFilter,
  setCertificateFilter,
  setLanguageFilter,
  setSpecialityFilter,
  toggleFranchiseModalStateAction,
} from "../../redux";
import {
  SET_SELECTED_COUNTRY,
  SET_SELECTED_FRANCHISE,
} from "../../redux/types";
import { PrimaryModal } from "../PrimaryModal";
import { FranchiseChangeErrorModal } from "./helper";
import Proptypes from "prop-types";
import "./style.css";

interface ChangeFranchiseModalProps {
  selectedCountryProp: any;
  setSelectedCountryProp: (data: {}) => void;
  shouldCallOnSuccess: boolean;
  setShouldCallOnSuccess: Dispatch<SetStateAction<boolean>>;
}

const ChangeFranchiseModal = (props: ChangeFranchiseModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isChangeFranchiseModalOpen, selectedFranchise, selectedCountry } =
    useSelector((state: any) => state.user);
  const { countries, franchiseList } = useSelector((state: any) => state.auth);

  const [localFranchiseList, setLocalFranchiseList] = useState<
    Array<FranchiseModal>
  >([]);

  const [errors, setErrors] = useState<FranchiseChangeErrorModal>({
    countryError: "",
    franchiseError: "",
  });

  const [selectedCountryLocal, setSelectedCountryLocal] = useState<number>(-1);
  const [selectedFranchiseLocal, setSelectedFranchiseLocal] = useState<
    number | undefined
  >(-1);

  const countryHandler = (id: number) => {
    setSelectedCountryLocal(id);
    let result: Array<FranchiseModal> = franchiseList?.filter(
      (franchise: FranchiseModal) => franchise?.country_id === id
    );
    setLocalFranchiseList(result);
    if (result?.length > 0) {
      setSelectedFranchiseLocal(result[0].id);
    }
    setErrors({ ...errors, countryError: "", franchiseError: "" });
  };

  useEffect(() => {
    if (
      selectedCountry?.id &&
      selectedFranchise?.id &&
      countries?.length > 0 &&
      franchiseList?.length > 0
    ) {
      setSelectedCountryLocal(selectedCountry?.id);
      setSelectedFranchiseLocal(selectedFranchise?.id);
      setLocalFranchiseList(
        franchiseList?.filter(
          (x: FranchiseModal) => x.country_id === selectedCountry.id
        )
      );
    }
  }, [selectedFranchise, selectedCountry, countries, franchiseList]);

  useEffect(() => {
    if (props.selectedCountryProp?.id) {
      setSelectedCountryLocal(props.selectedCountryProp?.id);
      let result: Array<FranchiseModal> = franchiseList?.filter(
        (franchise: FranchiseModal) =>
          franchise?.country_id === props.selectedCountryProp?.id
      );
      setLocalFranchiseList(result);
      if (result?.length > 0) {
        setSelectedFranchiseLocal(result[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedCountryProp?.id]);

  const handleModalClose = (seletedFranchiseObj: any) => {
    handleHide();
    if (props.shouldCallOnSuccess) {
      navigate(
        seletedFranchiseObj?.domain
          ? "/" + seletedFranchiseObj?.domain + "/packages"
          : "/"
      );
    }
  };

  const handleHide = () => {
    if (selectedCountry) {
      setSelectedCountryLocal(selectedCountry?.id);
    } else {
      setSelectedCountryLocal(-1);
    }
    if (selectedFranchise) {
      setSelectedFranchiseLocal(selectedFranchise?.id);
    } else {
      setSelectedFranchiseLocal(-1);
    }
    props.setSelectedCountryProp({});
    props.setShouldCallOnSuccess(false);
    dispatch(toggleFranchiseModalStateAction(false));
  };

  const franchiseHandler = (id: number) => {
    setSelectedFranchiseLocal(id);
    setErrors({ ...errors, franchiseError: "" });
  };

  const validateLocationModal = () => {
    let hasError = false;
    let _errors: FranchiseChangeErrorModal = {
      countryError: "",
      franchiseError: "",
    };
    if (selectedCountryLocal === -1 || !selectedCountryLocal) {
      hasError = true;
      _errors = { ..._errors, countryError: "Please select a country" };
    }
    if (selectedFranchiseLocal === -1 || !selectedFranchiseLocal) {
      hasError = true;
      _errors = { ..._errors, franchiseError: "Please select a franchise" };
    }
    setErrors(_errors);
    return hasError;
  };

  const handleLocationChange = () => {
    if (!validateLocationModal()) {
      if (
        selectedCountryLocal &&
        selectedFranchiseLocal &&
        localFranchiseList
      ) {
        const seletedFranchiseObj: any = localFranchiseList.find(
          (franchise: FranchiseModal) => franchise.id === selectedFranchiseLocal
        );
        const selectedCountryObj: CountryModal = countries.find(
          (contry: CountryModal) => contry.id === selectedCountryLocal
        );
        const franchise = !!seletedFranchiseObj
          ? seletedFranchiseObj
          : localFranchiseList[0];
        dispatch({
          type: SET_SELECTED_FRANCHISE,
          payload: franchise,
        });
        dispatch({ type: SET_SELECTED_COUNTRY, payload: selectedCountryObj });
        dispatch(setLanguageFilter([]));
        dispatch(setCertificateFilter([]));
        dispatch(setSpecialityFilter([]));
        dispatch(setCategoryFilter([]));
        dispatch(
          getFilterOptionsAction(franchise?.id, () => {
            dispatch(
              getTrainersAction({ page: 1, franchise_id: franchise?.id })
            );
          })
        );
        navigate(`/${seletedFranchiseObj?.domain}/all`);
        handleModalClose(seletedFranchiseObj);
      }
    }
  };

  return (
    <PrimaryModal
      isOpen={isChangeFranchiseModalOpen}
      onHide={handleHide}
      footer={false}
      title="Please select your location"
    >
      <>
        <Row className="justify-content-center pt-5 border-bottom">
          <Col xxl="7" xl="7" lg="7" md="9" sm="12" xs="12" className="pb-5">
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Select
                value={selectedCountryLocal}
                onChange={(event) => {
                  countryHandler(+event.target.value);
                }}
              >
                <option selected disabled value="-1">
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
              <Form.Text className="text-danger">
                {errors.countryError}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Select
                value={selectedFranchiseLocal}
                onChange={(event) => {
                  franchiseHandler(+event.target.value);
                }}
              >
                <option value="-1" selected disabled>
                  Please select Location
                </option>
                {localFranchiseList
                  ?.sort((a: FranchiseModal, b: FranchiseModal) =>
                    a.name.localeCompare(b.name)
                  )
                  .map((franchise: FranchiseModal) => {
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
            <Button
              variant="primary"
              className="background-primary border-color-primary font-family-poppins text-light w-100 mt-3"
              onClick={handleLocationChange}
            >
              Save
            </Button>
          </Col>
        </Row>
      </>
    </PrimaryModal>
  );
};

ChangeFranchiseModal.propTypes = {
  selectedCountryProp: Proptypes.any,
  setSelectedCountryProp: Proptypes.func,
  shouldCallOnSuccess: Proptypes.bool,
  setShouldCallOnSuccess: Proptypes.func,
};

export { ChangeFranchiseModal };
