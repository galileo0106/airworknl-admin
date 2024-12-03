import { apis } from "../../apis";
import { SET_NOTIFICATION_COUNT } from "../actionTypes";
import { store } from "../store";

export const getNotificationCounts = async () => {
  try {
    const {
      data: { unreadNotificationCount },
    } = await apis.getUnreadNotificationCounts();
    store.dispatch({
      type: SET_NOTIFICATION_COUNT,
      payload: unreadNotificationCount,
    });
  } catch (error) {}
};
