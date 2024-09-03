import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Image } from "react-bootstrap";
import { LOCATION_PIN } from "../../assets/images";
import { useGeolocated } from "react-geolocated";

const CurrentLocation = () => {
  const { franchise_name, lat, lng } = useParams();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchise_name, lat, lng]);

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const Marker = (props: any) => {
    return (
      <FontAwesomeIcon
        style={{ fontSize: "20px" }}
        icon={faLocationDot}
        color="red"
      />
    );
  };

  const MyLocationMarker = (props: any) => {
    return <Image style={{ width: "30px" }} src={LOCATION_PIN} />;
  };

  return (
    <div style={{ width: "100%", height: "100vh" }} role="button">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyCbjJnTaH7q_Fi1ghtHpPf9KphpROoumpc",
          language: "en",
        }}
        defaultCenter={{
          lat: lat ? +lat : 0.0,
          lng: lng ? +lng : 0.0,
        }}
        defaultZoom={16}
      >
        <Marker lat={lat ? +lat : 0.0} lng={lng ? +lng : 0.0} />
        {coords?.latitude && coords?.longitude ? (
          <MyLocationMarker lat={coords?.latitude} lng={coords?.longitude} />
        ) : null}
      </GoogleMapReact>
    </div>
  );
};

export { CurrentLocation };
