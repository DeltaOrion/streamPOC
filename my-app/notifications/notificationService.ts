import { axiosInstance } from "../axiosClient";
import { AddDeviceInput } from "./addDeviceInput";

type NotificationServiceType = {
  addDevice: (input: AddDeviceInput) => Promise<void>;
};

async function addDevice(input: AddDeviceInput) {
    return (await axiosInstance.post<void>(`/notification/addDevice`, input))
      .data;
  }
export const notificationService: NotificationServiceType = {
  addDevice: addDevice
};
