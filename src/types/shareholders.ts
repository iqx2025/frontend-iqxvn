export interface ShareholderDetail {
  investorFullName: string;
  pctOfSharesOutHeld: number;
  sharesHeld: number;
  currentValue: number;
  changeValue: number;
  countryOfInvestor: string;
}

export interface FundHolding {
  fundId: number;
  fundCode: string;
  fundName: string;
  issuer: string;
  fillingDate: string;
  ticker: string;
  sharesHeld: number;
  sharesHeldValueVnd: number;
  pctPortfolio: number;
  imageUrl: string;
}

export interface OwnershipBreakdown {
  investorType: string;
  pctOfSharesOutHeldTier: number;
  children?: OwnershipBreakdown[];
}

export interface ShareholdersApiResponse {
  status: number;
  message: string;
  data: OwnershipBreakdown[];
}

export interface ShareholderDetailsApiResponse {
  status: number;
  message: string;
  data: {
    shareholderDetails: ShareholderDetail[];
    fundHoldings: FundHolding[];
  };
}

export interface ShareholdersData {
  ownershipBreakdown: OwnershipBreakdown[];
  shareholderDetails: ShareholderDetail[];
  fundHoldings: FundHolding[];
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}
