import axios from "axios";
import { linearExchangeUrl } from "../constants";
import { TokenVolumes } from "../types";

//  Get Token Volume in last 24 hours by Asset
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
    console.error(err);
  }
  let count = 0;
  tokenVolumes.forEach(item => {
    count += Number(item.volume);
  })
  console.log(`Last 24h trading volume of asset - ${key} is: ${count}`);
}