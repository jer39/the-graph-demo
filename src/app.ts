import axios from 'axios';
import { LinearFinanceAssetType, TokenVolumes, TransferItem, TransferObj } from './types';
import { map } from "lodash";

const url = "https://api.thegraph.com/subgraphs/name/jer39/liquefy-demo-subgraph";
const linearFinanceUrl = "https://graph.linear.finance/subgraphs/name/linear-finance/exchange-bsc";

//  Only calculate users who transfer "SOMETHING" to others as active users
const getDailyActiveUsers = async () => {
  let transfers: TransferItem[] = [];
  try {
    console.log("Querying Transfer Items...");
    const res = await axios.post<TransferObj>(url, {
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
    console.log("Query Transfer Item finished");
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
  console.log("Get Daily Active Users Finished");
  console.log(`Daily Active Users on Trading LINA token: ${lastItem.activeUsersCount} `);
}

const getVolumeByAsset = async (key: string) => {
  let tokenVolumes: TokenVolumes[] = [];
  try {
    const res = await axios.post(linearFinanceUrl, {
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

const main = async () => {
  //  Get Active Users on LINA token
  await getDailyActiveUsers();
  //  Get volumes of each assets for last 24 hours
  map(LinearFinanceAssetType, key => getVolumeByAsset(key));
}

main();