import { axiosInstance } from "../axiosClient";
import { createChannelRequest } from "./createChannelRequest";

type ChannelServiceType = {
  create: (request: createChannelRequest) => Promise<string>;
};

async function create(request: createChannelRequest) {
  return (await axiosInstance.post("/channels", request)).data;
}

export const channelService: ChannelServiceType = {
  create: create,
};
