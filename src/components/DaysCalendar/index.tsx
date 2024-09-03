import moment from "moment";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { IC_BOX, IC_TICK } from "../../assets/images";
import "./style.css";

interface DaysPickerProps {
  onSelect?: any;
  onPreferredTimeSelect?: any;
  onPreferredFlexibleSelect?: any;
  defaultSelected?: Array<any>;
  preferredTime?: any;
}

const DayCard = ({ day, onItemSelect }: { day: any; onItemSelect: any }) => {
  const [mValue, setMvalue] = useState<boolean>(false);
  const [aValue, setAvalue] = useState<boolean>(false);
  const [eValue, setEvalue] = useState<boolean>(false);

  const press = (name: string) => {
    if (name === "morning") setMvalue(mValue ? false : true);
    if (name === "afternoon") setAvalue(aValue ? false : true);
    if (name === "evening") setEvalue(eValue ? false : true);
    if (onItemSelect) onItemSelect(name);
  };
  return (
    <div className="day-wrapper">
      {day.names ? (
        <>
          <div></div>
          <div onClick={() => press("morning")}>
            <span className="text">Morning</span>
          </div>

          <div onClick={() => press("afternoon")}>
            <span className="text">Afternoon</span>
          </div>

          <div onClick={() => press("evening")}>
            <span className="text">Evening</span>
          </div>
        </>
      ) : (
        <>
          <div>
            <span className="text">{day.day}</span>
          </div>

          <div onClick={() => press("morning")}>
            <Image src={mValue ? IC_TICK : IC_BOX} className="icon" />
          </div>

          <div onClick={() => press("afternoon")}>
            <Image src={aValue ? IC_TICK : IC_BOX} className="icon" />
          </div>

          <div onClick={() => press("evening")}>
            <Image src={eValue ? IC_TICK : IC_BOX} className="icon" />
          </div>
        </>
      )}
    </div>
  );
};

const DaysPicker = (props: DaysPickerProps) => {
  const initialDaily = {
    morning: false,
    afternoon: false,
    evening: false,
  };
  const [isFlexible, setIsFlexible] = useState<boolean>(true);
  const [prefStartTime, setPrefStartTime] = useState<any>();

  const [days, setDaya] = useState<Array<any>>([
    {
      names: true,
    },
    {
      day: "Sunday",
      ...initialDaily,
    },
    {
      day: "Monday",
      ...initialDaily,
    },
    {
      day: "Tuesday",
      ...initialDaily,
    },
    {
      day: "Wednesday",
      ...initialDaily,
    },
    {
      day: "Thursday",
      ...initialDaily,
    },
    {
      day: "Friday",
      ...initialDaily,
    },
    {
      day: "Saturday",
      ...initialDaily,
    },
  ]);

  const onItemSelect = (item_index: number, name: string) => {
    const tempDays: any = [...days];
    tempDays[item_index][name] = !tempDays[item_index][name];
    setDaya(tempDays);
    props.onSelect(tempDays);
  };
  useEffect(() => {
    console.log(props.preferredTime);
    if (props.preferredTime) {
      setPrefStartTime(
        moment(props.preferredTime, "hh:mm a").format("HH:mm:ss")
      );
    }
  }, [props.preferredTime]);
  useEffect(() => {
    props.onPreferredFlexibleSelect(isFlexible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlexible]);

  return (
    <div className="container">
      {days.map((day: any, index: number) => {
        return (
          <DayCard
            onItemSelect={(name: string) => onItemSelect(index, name)}
            day={day}
          />
        );
      })}
      <div>
        <div className="preferred_time_row">
          <span className="name-text mt-3">Preferred start time*</span>
          <input
            type={"time"}
            className="time_input"
            value={prefStartTime}
            onChange={(ele) => props.onPreferredTimeSelect(ele.target.value)}
          />
        </div>
      </div>
      <div className="flexible_container">
        <div className="flexible_row">
          <span className="name-text mt-3">
            {"Are you flexible on your time*"}
          </span>
        </div>
        <div className="options_container">
          <div className="option" onClick={() => setIsFlexible(true)}>
            <span>Yes</span>
            <Image
              className="icon_flexible"
              src={isFlexible ? IC_TICK : IC_BOX}
            />
          </div>
          <div className="option ms-5" onClick={() => setIsFlexible(false)}>
            <span>No</span>
            <Image
              className="icon_flexible"
              src={!isFlexible ? IC_TICK : IC_BOX}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { DaysPicker };
