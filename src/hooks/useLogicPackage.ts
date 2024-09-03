import { cloneDeep } from "lodash";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  getAllPackageStatsAction,
  getEligiblePackageListAction,
  getPackageStatsAction,
  getUserPackageAction,
} from "../redux";

const useLogicPackage = () => {
  const { profile } = useSelector((state: any) => state.user);
  const { userPackages } = useSelector((state: any) => state.package);
  const dispatch = useDispatch<AppDispatch>();

  const fetchUserPackage = async () => {
    if (profile?.id) {
      let data: any = await dispatch(
        getUserPackageAction(profile?.id, "ACTIVE")
      );
      if (data?.data?.result) {
        return data?.data?.result;
      }
    }
    return [];
  };

  const checkUserHasActivePackage = async () => {
    let hasActivePackage = false;
    let myPurchaseList: Array<any> = await fetchUserPackage();
    if (myPurchaseList && myPurchaseList?.length > 0) {
      for (let index = 0; index < myPurchaseList.length; index++) {
        const element = myPurchaseList[index];
        let expiration_time = moment(element.expire_time).format("MM/DD/YYYY");
        if (moment(expiration_time) > moment(new Date())) {
          hasActivePackage = true;
        }
      }
    }
    return hasActivePackage;
  };

  const getUserActiveCategories = () => {
    if (!userPackages || !userPackages?.length) {
      return [];
    }
    let myPurchaseList: Array<any> = cloneDeep(userPackages);
    if (myPurchaseList && myPurchaseList?.length > 0) {
      let activeUserPckages = myPurchaseList.filter(
        (x: any) => x.status === "ACTIVE"
      );

      let arr: any = [];
      let uniqService: any = {};

      for (let index = 0; index < activeUserPckages.length; index++) {
        let services = activeUserPckages[index].categories;
        for (let i = 0; i < services.length; i++) {
          uniqService[services[i].id] = services[i];
        }
      }

      for (const key in uniqService) {
        if (Object.prototype.hasOwnProperty.call(uniqService, key)) {
          const element = uniqService[key];
          arr.push(element);
        }
      }
      return arr;
    }
    return [];
  };

  const getActivePackageType = () => {
    if (!userPackages || !userPackages?.length) {
      return [];
    }
    let myPurchaseList: Array<any> = cloneDeep(userPackages);
    if (myPurchaseList && myPurchaseList?.length > 0) {
      let activeUserPckages = myPurchaseList.filter(
        (x: any) => x.status === "ACTIVE"
      );

      let arr: any = [];
      let uniqType: any = {};

      for (let index = 0; index < activeUserPckages.length; index++) {
        let type: any = activeUserPckages[index].package.PackageType;
        uniqType[type.id] = type;
      }

      for (const key in uniqType) {
        if (Object.prototype.hasOwnProperty.call(uniqType, key)) {
          const element = uniqType[key];
          arr.push(element);
        }
      }
      return arr;
    }
    return [];
  };

  const getEligiablePackageList = async (
    package_type_id: number,
    category_id: number
  ) => {
    let packageList: any = await dispatch(
      getEligiblePackageListAction(profile?.id, package_type_id, category_id)
    );
    if (packageList) {
      packageList.map((x: any) => {
        x.display =
          x.description +
          " | bought on " +
          moment(x.created_at).format("MMM-DD-YYYY hh:mm a");
        return x;
      });
    }
    for (let index = 0; index < packageList?.length; index++) {
      const element = packageList[index];
      if (new Date(element.expire_time).getTime() < new Date().getTime()) {
        packageList.splice(index, 1);
      }
    }
    return packageList;
  };

  const getPackageStats = async (packageId: number) => {
    let packageStats: any = await dispatch(
      getPackageStatsAction(profile?.id, packageId)
    );
    return packageStats;
  };

  const getAllPackageStats = () => {
    dispatch(getAllPackageStatsAction(profile?.id));
  };

  return {
    fetchUserPackage,
    checkUserHasActivePackage,
    getEligiablePackageList,
    getUserActiveCategories,
    getActivePackageType,
    getPackageStats,
    getAllPackageStats,
  };
};

export { useLogicPackage };
