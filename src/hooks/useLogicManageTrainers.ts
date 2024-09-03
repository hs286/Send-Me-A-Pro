import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  getTrainersWithStatusAction,
  updateOpportunityStatusAction,
} from "../redux";

const useLogicManageTrainers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: any) => state.user);
  const { activeTrainers } = useSelector((state: any) => state.trainers);

  const getAvailableTrainers = () => {
    dispatch(getTrainersWithStatusAction(profile?.id, ["TA", "TH", "TAR"]));
  };

  const onArchiveTrainer = (oppId: number) => {
    dispatch(
      updateOpportunityStatusAction(oppId, "TAR", () => {
        getAvailableTrainers();
      })
    );
  };

  const onUnarchiveTrainer = (oppId: number) => {
    dispatch(
      updateOpportunityStatusAction(oppId, "TA", () => {
        getAvailableTrainers();
      })
    );
  };

  return {
    activeTrainers,
    getAvailableTrainers,
    onArchiveTrainer,
    onUnarchiveTrainer,
  };
};

export { useLogicManageTrainers };
