
import { CarbonData, OmniEsgConfidence } from '../types';

/**
 * Universal Verification Engine (萬能檢驗引擎)
 * 負責底層數據邏輯的控管、單元檢測與自動除錯。
 */
export class VerificationEngine {
  
  // 數據邊界檢測 (Bounds Checking)
  static checkCarbonIntegrity(data: CarbonData): { 
      status: 'VALID' | 'WARNING' | 'INVALID', 
      confidence: OmniEsgConfidence,
      messages: string[] 
  } {
    const messages: string[] = [];
    let status: 'VALID' | 'WARNING' | 'INVALID' = 'VALID';
    let confidence: OmniEsgConfidence = 'high';

    // 邏輯 1: Scope 1 不能為負數
    if (data.scope1 < 0) {
      status = 'INVALID';
      messages.push("Critical: Scope 1 emissions cannot be negative.");
      confidence = 'low';
    }

    // 邏輯 2: 能耗比率異常檢測 (例如: 1公升燃料產出過多二氧化碳)
    const fuelCo2Ratio = data.scope1 / (data.fuelConsumption || 1);
    if (data.fuelConsumption > 0 && (fuelCo2Ratio > 10 || fuelCo2Ratio < 1)) {
      status = 'WARNING';
      messages.push("Anomaly: Fuel to CO2 ratio seems unusual for industry standards.");
      confidence = 'medium';
    }

    // 邏輯 3: 數據陳舊性檢測 (超過 30 天未更新)
    const daysSinceUpdate = (Date.now() - data.lastUpdated) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 30) {
      status = 'WARNING';
      messages.push("Stale Data: Inventory hasn't been updated for over 30 days.");
      confidence = 'medium';
    }

    return { status, confidence, messages };
  }

  /**
   * 選項化解決方針：自動修正
   */
  static applyAutoFix(data: CarbonData, errorType: string): CarbonData {
      switch(errorType) {
          case 'NEGATIVE_VALUE':
              return { ...data, scope1: Math.max(0, data.scope1) };
          default:
              return data;
      }
  }

  // AI 輸出檢驗 (幻覺檢測 L3 Layer)
  static verifyAiOutput(text: string, facts: string[]): number {
    let score = 100;
    facts.forEach(fact => {
        if (!text.includes(fact)) score -= 20;
    });
    return Math.max(0, score);
  }
}
