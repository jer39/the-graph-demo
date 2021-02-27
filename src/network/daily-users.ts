import axios from "axios";
import { map } from "lodash";
import { linearBuildrUrl, customSubgraphUrl } from "../constants";
import { TransferItem } from "../types";

export const getDailyActiveUsers = async (mode: "Buildr" | "Lina") => {
  let transfers: TransferItem[] = [];
  try {
    let url = mode === "Buildr" ? linearBuildrUrl : customSubgraphUrl;
    const res = await axios.post(url, {
      query: `
        {
          transfers(first: 1000, orderBy: timestamp, orderDirection: desc) {
            from
            timestamp
          }
        }
      `
    });
    transfers = res.data.data.transfers;
  } catch (err) {
    console.error(err);
  }

  const activeUsersByDate: Record<string, string[]> = {};

  transfers.forEach(transferItem => {
    const timestamp = Number(transferItem.timestamp);
    const date = new Date(timestamp * 1000);
    const isoDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    if (!activeUsersByDate[isoDate]) {
      activeUsersByDate[isoDate] = [transferItem.from];
    } else {
      const foundUser = activeUsersByDate[isoDate].find(user => user === transferItem.from);
      if (!foundUser) {
        activeUsersByDate[isoDate].push(transferItem.from);
      }
    }
  });

  const list = map(activeUsersByDate, (value, key) => {
    return {
      date: key,
      activeUsersCount: value.length
    }
  }).sort((a, b) => {
    return new Date(b.date) > new Date(a.date) ? -1 : 1;
  });
  
  const lastItem = list.pop();
  return {
    mode,
    activeUsersCount: lastItem.activeUsersCount
  }
}