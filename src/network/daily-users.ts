import axios from "axios";
import { getDayEnd, getDayStart } from "../utils/time-utils";
import { TransferItem } from "../types";

//  Get Daily Active Users (Custom subgraph)
export const getDailyActiveUsers = async (endpoint: string, key: "transfers" | "transferFroms") => {
  let transfers: TransferItem[] = [];
  //  Compute current day start timestamp
  const dayStartTimestamp = Math.round(getDayStart(new Date()).getTime() / 1000);
  //  Compute current day end timestamp
  const dayEndTimestamp = Math.round(getDayEnd(new Date()).getTime() / 1000);
  try {
    let url = endpoint;
    const res = await axios.post(url, {
      query: `
        {
          ${key}(first: 1000, orderBy: timestamp, orderDirection: desc,
          where: {
            timestamp_gte: ${dayStartTimestamp}
            timestamp_lte: ${dayEndTimestamp}
          }) {
            from
          }
        }
      `
    });
    transfers = res.data.data[key];
  } catch (err) {
    console.error("error");
  }

  const userAddress: string[] = [];

  transfers.forEach(transferItem => {
    const foundUser = userAddress.find(user => user === transferItem.from);
    if (!foundUser) {
      userAddress.push(transferItem.from);
    }
  });

  return userAddress.length;
}