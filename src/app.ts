import { LinearFinanceAssetType } from './types';
import { forEach, map } from "lodash";
import { getTradingVolume, getVolumeByAsset } from './network/asset-volumes';
import { getDailyActiveUsers } from './network/daily-users';
import { customSubgraphUrl, linearBuildrUrl } from './constants';

const main = async () => {

  console.log("-------------------Start Level One-------------------");

  //  Get Active Users on Linear Buildr
  //  Public data source found on Linear Buildr playform
  // const buildrCount = await getDailyActiveUsers(linearBuildrUrl, "transfers");
  // console.log(`Daily Active Users on Linear Buildr: ${buildrCount}`);

  //  Use the graph to grab the data on Ethereum mainnet
  //  Get how many times event Transfer was triggered within today (Selfmade subgraph)
  const transferCount = await getDailyActiveUsers(customSubgraphUrl, "transfers");
  console.log(`Daily Active Users by calculating Transfer Event on Linear Finance contract: ${transferCount}`);

  //  Get Active Users on Linear Exchange by custom subgraph (Calculate how many users trigger transferFrom function within a day)
  const transferFromCount = await getDailyActiveUsers(customSubgraphUrl, "transferFroms");
  console.log(`Daily Active Users by capturing transferFrom function on Linear Finance contract: ${transferFromCount}`);

  //  Cannot find any Subgraphs to access Active Users on Linear Exchange

  console.log("-------------------End Level One-------------------");
  
  console.log("-------------------Start Level Two-------------------");

  //  Get trading volume of each assets for last 24 hours displayed on Linear Exchange Platform
  //  Public data source found on Linear Exchange playform
  // const dataArr = await Promise.allSettled(map(LinearFinanceAssetType, key => getVolumeByAsset(key)));
  // forEach(dataArr, data => {
  //   if (data.status === "fulfilled") {
  //     console.log(`Last 24h trading volume of asset - ${data.value.key} is: ${data.value.tokenVolume}`);
  //   }
  // });

  //  Get 24 hours trading volume of BNB
  const bnbVolume = await getTradingVolume("Bnb");
  console.log(`Last 24h trading volume of asset - BNB is: ${bnbVolume}`);

  //  Get 24 hours trading volume of Link
  const linkVolume = await getTradingVolume("Link");
  console.log(`Last 24h trading volume of asset - LINK is: ${linkVolume}`);

  console.log("-------------------End Level Two-------------------");
}

main();