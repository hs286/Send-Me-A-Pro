import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  AppDispatch,
  FranchiseModal,
  getAppSettingByTypeAction,
} from "../../redux";
import "./style.css";

const FaqPage = () => {
  const { franchise_name, enquiry_type } = useParams();
  const { franchiseList } = useSelector((state: any) => state.auth);
  const { appSettings } = useSelector((state: any) => state.appSettings);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (franchiseList?.length) {
      let name = franchise_name;
      let _franchise: FranchiseModal = franchiseList?.find(
        (franchise: FranchiseModal) => franchise.domain === name
      );
      if (enquiry_type) {
        dispatch(getAppSettingByTypeAction(enquiry_type, _franchise?.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchise_name, franchiseList?.length, enquiry_type]);

  return (
    <>
      {console.log(appSettings)}
      <Container>
        <div
          dangerouslySetInnerHTML={{
            __html: appSettings?.content || "",
          }}
        />
      </Container>
    </>
  );
};

export { FaqPage };
