import { StockSummary } from "@/types/stock";
import { CompanyData } from "./api";

/**
 * Service for transforming API data to application-specific formats
 */
export class TransformationService {
  /**
   * Transform API CompanyData to StockSummary format
   * @param apiData - Raw company data from API
   * @returns Transformed StockSummary object
   */
  static transformApiDataToStockSummary(apiData: CompanyData): StockSummary {
    return {
      id: apiData.id,
      ticker: apiData.ticker,
      nameVi: apiData.nameVi,
      nameEn: apiData.nameEn,
      name: apiData.nameVi,
      industryActivity: apiData.industryActivity,
      bcIndustryGroupId: apiData.bcIndustryGroupId,
      bcIndustryGroupSlug: apiData.bcIndustryGroupSlug,
      bcIndustryGroupCode: apiData.bcIndustryGroupCode,
      bcIndustryGroupType: apiData.bcIndustryGroupType,
      bcEconomicSectorId: apiData.bcEconomicSectorId,
      bcEconomicSectorSlug: apiData.bcEconomicSectorSlug,
      bcEconomicSectorName: apiData.bcEconomicSectorName,
      website: apiData.website,
      mainService: apiData.mainService,
      businessLine: apiData.businessLine,
      businessStrategy: apiData.businessStrategy,
      businessRisk: apiData.businessRisk,
      businessOverall: apiData.businessOverall,
      detailInfo: apiData.detailInfo,
      marketCap: parseFloat(apiData.marketCap),
      outstandingSharesValue: parseFloat(apiData.outstandingSharesValue),
      analysisUpdated: new Date(apiData.analysisUpdated).toLocaleDateString('vi-VN'),
      stockExchange: apiData.stockExchange,
      noOfRecommendations: 1,
      priceClose: apiData.priceClose,
      isInWatchlist: apiData.isInWatchlist || false,
      netChange: apiData.netChange,
      pctChange: apiData.pctChange,
      priceReferrance: apiData.priceReference,
      priceOpen: apiData.priceOpen,
      priceFloor: apiData.priceFloor,
      priceLow: apiData.priceLow,
      priceHigh: apiData.priceHigh,
      priceCeiling: apiData.priceCeiling,
      priceTimeStamp: new Date(apiData.priceTimestamp).toLocaleString('vi-VN'),
      priceType: apiData.priceType,
      volume10dAvg: parseFloat(apiData.volume10dAvg),
      volume: parseFloat(apiData.volume),
      peRatio: apiData.peRatio,
      pbRatio: apiData.pbRatio,
      epsRatio: apiData.epsRatio,
      evEbitdaRatio: 8.16, // Default value as not in API
      bookValue: apiData.bookValue,
      freeFloatRate: apiData.freeFloatRate,
      valuationPoint: apiData.valuationPoint,
      growthPoint: apiData.growthPoint,
      passPerformancePoint: apiData.passPerformancePoint,
      financialHealthPoint: apiData.financialHealthPoint,
      dividendPoint: apiData.dividendPoint,
      imageUrl: apiData.imageUrl,
      beta5y: apiData.beta5y,
      pricePctChg7d: apiData.pricePctChg7d,
      pricePctChg30d: apiData.pricePctChg30d,
      pricePctChgYtd: apiData.pricePctChgYtd,
      pricePctChg1y: apiData.pricePctChg1y,
      pricePctChg3y: apiData.pricePctChg3y,
      pricePctChg5y: apiData.pricePctChg5y,
      companyQuality: apiData.companyQuality,
      overallRiskLevel: apiData.overallRiskLevel,
      qualityValuation: apiData.qualityValuation,
      taSignal1d: apiData.taSignal1d,
      watchlistCount: apiData.watchlistCount,
      roe: apiData.roe,
      roa: apiData.roa,
      revenue5yGrowth: apiData.revenue5yGrowth,
      netIncome5yGrowth: apiData.netIncome5yGrowth,
      revenueLtmGrowth: apiData.revenueLtmGrowth,
      netIncomeLtmGrowth: apiData.netIncomeLtmGrowth,
      revenueGrowthQoq: apiData.revenueGrowthQoq,
      netIncomeGrowthQoq: apiData.netIncomeGrowthQoq,
      type: apiData.type,
      country: apiData.country
    };
  }

  /**
   * Validate required fields in CompanyData
   * @param apiData - Raw company data from API
   * @returns boolean indicating if data is valid
   */
  static validateCompanyData(apiData: CompanyData): boolean {
    const requiredFields = ['id', 'ticker', 'nameVi', 'priceClose'];
    return requiredFields.every(field => apiData[field as keyof CompanyData] !== undefined);
  }

  /**
   * Get default values for missing fields
   * @returns Partial StockSummary with default values
   */
  static getDefaultValues(): Partial<StockSummary> {
    return {
      evEbitdaRatio: 8.16,
      noOfRecommendations: 1,
      isInWatchlist: false,
    };
  }
}
