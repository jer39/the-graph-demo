import { LinearFinanceAssetType } from './types';
import { forEach, map } from "lodash";
import { getVolumeByAsset } from './network/asset-volumes';
import { getDailyActiveUsers } from './network/daily-users';

const main = async () => {

  console.log("-------------------Start Level One-------------------");

  //  Use the graph to grab the data on Ethereum mainnet
  //  Get Transactions on Lina token (Selfmade subgraph)
  const linaUserRes = await getDailyActiveUsers("Lina");
  console.log(`Daily Active Users on Linear ${linaUserRes.mode}: ${linaUserRes.activeUsersCount}`);

  //  Get Active Users on Linear Buildr
  const buildrUserRes = await getDailyActiveUsers("Buildr");
  console.log(`Daily Active Users on Linear ${buildrUserRes.mode}: ${buildrUserRes.activeUsersCount}`);

  //  Cannot find any Subgraphs to access Active Users on Linear Exchange

  console.log("-------------------End Level One-------------------");
  
  console.log("-------------------Start Level Two-------------------");

  //  Get volumes of each assets for last 24 hours
  const dataArr = await Promise.allSettled(map(LinearFinanceAssetType, key => getVolumeByAsset(key)));
  forEach(dataArr, data => {
    if (data.status === "fulfilled") {
      console.log(`Last 24h trading volume of asset - ${data.value.key} is: ${data.value.tokenVolume}`);
    }
  });

  console.log("-------------------End Level Two-------------------");
}

main();