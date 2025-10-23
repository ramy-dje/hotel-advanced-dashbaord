interface TiersTable {
  tiers: {
    id: number;
    label: string;
    from: number;
    to?: number;
    baseOccupants: {
      adult: number;
      child: number;
    };
    baseRates: {
      adult: number;
      child: number;
    };
  }[];
  extraOccupants: number[];
}

export interface CreateRatePlanInterface {
    rateName: string;
    rateCode: string;
    rateCategory?: string;
    rateType: string;
    assignedTo?: string[];
    description?: string;
  
    // One global predefined season
    predefinedSeason?: string;
  
    // Multiple date+weekday periods
    seasonPeriods: {
      beginSellDate: Date;
      endSellDate: Date;
      weekdays: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
    }[];
  
    mealPlan?: ('room only' | 'breakfast' | 'lunch' | 'dinner' | 'extra meal')[];
    mealPlanCode?: string;
    isActive?: boolean;
    minStay: number;
    maxStay?: number;
    minAdvancedBooking: string;
    maxAdvancedBooking?: string;
    ageRestriction: string;
    selectedTax: string;
    taxIncluded: boolean;
    factorRateCalculator: string;
    yieldStatus: boolean;
    refundBeforeArrival?: number;
    refundType?: string;
    partialRefundAmount?: number;
  
    policies?: {
      title: string;
      items: {
        icon: string;
        text: string;
      }[];
    }[];
    TiersTable: TiersTable;

  }
  export interface RatePlanInterface extends CreateRatePlanInterface {
    id: string;
    createdAt: string | Date;
    updateAt: string | Date;
  }
  