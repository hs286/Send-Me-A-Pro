import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, createRequestAndHireTrainerAction } from "../redux";

interface UseLogicHireProps {
  beginTraining: string;
  sessionTime: string;
  coordinate: string;
  location: string;
  selectedService: number;
  selectedPackageType: number;
  trainer_id: number;
  zipcode?: string;
  status?: string;
  message?: string;
}

const useLogicHire = (props: UseLogicHireProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: any) => state.user);
  const {
    beginTraining,
    sessionTime,
    coordinate,
    location,
    selectedService,
    selectedPackageType,
    trainer_id,
    zipcode = "",
    status = "",
    message = "",
  } = props;
  let sessions: any = {
    // beginTraining: moment(beginTraining, 'l').format('YYYY-MM-DD'),
    // sessionTime: moment(`${beginTraining} ${sessionTime}`, 'l h:mm A').format('YYYY-MM-DD HH:mm:ss'),
    beginTraining: beginTraining,
    sessionTime: `${sessionTime}`,
    coordinate,
    location,
    zipcode,
    status,
    message,
    category_id: selectedService,
    package_type_id: selectedPackageType,
  };

  const submitForm = async (onSuccess?: any) => {
    if (!selectedService || !selectedPackageType) {
      return;
    }
    sessions.beginTraining = moment(
      beginTraining,
      profile?.Country?.iso === "US" ? "MM/DD/YYYY" : "DD/MM/YYYY"
    ).format("YYYY-MM-DD");
    sessions.sessionTimeString = `${sessions.beginTraining} ${sessions.sessionTime}`;
    sessions.sessionTime = moment(
      `${beginTraining} ${sessionTime}`,
      profile?.Country?.iso === "US"
        ? "MM/DD/YYYY h:mm A"
        : profile?.Country?.iso === "GB"
        ? "DD/MM/YYYY HH:MM"
        : "DD/MM/YYYY h:mm A"
    ).format("YYYY-MM-DD HH:mm:ss");
    sessions.category_id = selectedService;
    sessions.package_type_id = selectedPackageType;
    if (trainer_id) {
      const userId = profile?.id;
      sessions.status = null;
      sessions.user_id = userId;
      sessions.trainer_id = trainer_id;
      dispatch(
        createRequestAndHireTrainerAction(
          sessions,
          (data: any) => {
            onSuccess && onSuccess(data);
          },
          (error) => {
            toast.error(error.response.data.result || "error");
          }
        )
      );
    }
  };
  return { submitForm };
};

export { useLogicHire };
