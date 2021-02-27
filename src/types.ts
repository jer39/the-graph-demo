export enum LinearFinanceAssetType {
  ADA = "lADA",
  BNB = "lBNB",
  BTC = "lBTC",
  DOT = "lDOT",
  ETH = "lETH",
  LINK = "lLINK",
  TRX = "lTRX",
  XAG = "lXAG",
  XAU = "lXAU",
  XLM = "lXLM",
  YFI = "lYFI"
}

export type TokenVolumes = {
  volume: string;
};

export type TransferItem = {
  id: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  block: number;
}