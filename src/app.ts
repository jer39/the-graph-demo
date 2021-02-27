import { LinearFinanceAssetType } from './types';
import { map } from "lodash";
import { getVolumeByAsset } from './network/asset-volumes';
import { getDailyActiveUsers } from './network/daily-users';

const main = async () => {
  //  Get Active Users on Linear Buildr and Linear Exchange
  await getDailyActiveUsers("Buildr");
  await getDailyActiveUsers("Lina");

  //  Get volumes of each assets for last 24 hours
  map(LinearFinanceAssetType, key => getVolumeByAsset(key));
}

main();