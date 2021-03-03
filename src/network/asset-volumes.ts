import axios from "axios";
import { customSubgraphUrl, linearExchangeUrl } from "../constants";
import { TokenVolumes, TransferItem } from "../types";

//  Get Token Volume in last 24 hours by Asset (Public source)
export const getVolumeByAsset = async (key: string) => {
  let tokenVolumes: TokenVolumes[] = [];
  try {
    const res = await axios.post(linearExchangeUrl, {
      query: `
        {
          tokenVolumes(first: 1000, skip: 0, orderBy: timestampHour, orderDirection: desc,
          where: {
            source:\"${key}\",
            timestampHour_gte:448428
          }) {
            volume
          }
        }
      `
    });
    tokenVolumes = res.data.data.tokenVolumes;
  } catch (err) {
    console.error("error");
  }
  let count = 0;
  tokenVolumes.forEach(item => {
    count += Number(item.volume);
  });

  return {
    key,
    tokenVolume: count
  }
}

//  Get Trading Volume by adding up value in every Transfer event in each asset (Custom subgraph)
export const getTradingVolume = async (key: "Bnb" | "Link") => {
  let transferList: TransferItem[] = [];
  const targetTimestamp = Math.round(new Date().getTime() / 1000) - (60 * 60 * 24);
  try {
    const res = await axios.post(customSubgraphUrl, {
      query: `
        {
          transfer${key}s(first: 1000, orderBy: timestamp, orderDirection: desc,
          where: {
            timestamp_gte: ${targetTimestamp}
          }) {
            value
          }
        }
      `
    });
    transferList = res.data.data[`transfer${key}s`];
  } catch (err) {
    console.error("error");
  }

  let volumeCount = 0;

  transferList.forEach(transferItem => {
    volumeCount += Number(transferItem.value);
  });

  return volumeCount;
}