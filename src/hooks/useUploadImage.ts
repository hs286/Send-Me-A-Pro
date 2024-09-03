import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, updateUserAvatarAction } from "../redux";

const useUploadImage = () => {
  const [loadingSelecting, setLoadingSelecting] = useState<boolean>(false);
  const { profile } = useSelector((state: any) => state.user);

  const dispatch = useDispatch<AppDispatch>();
  const uploadImage = async (
    response: any,
    successCallback?: (data: any) => void,
    errorCallback?: (error: any) => void
  ) => {
    if (response) {
      setLoadingSelecting(true);
      const userId = profile?.id;
      var formData = new FormData();
      formData.append("name", "testName");
      formData.append("avatar", response);
      await dispatch(
        updateUserAvatarAction(
          userId,
          formData,
          (data: any) => {
            successCallback && successCallback(data);
            setLoadingSelecting(false);
          },
          (error: any) => {
            errorCallback && errorCallback(error);
            setLoadingSelecting(false);
          }
        )
      );
    }
  };
  return {
    uploadImage,
    loadingSelecting,
  };
};

export { useUploadImage };
