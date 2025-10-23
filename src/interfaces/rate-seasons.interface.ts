export interface CreateRatePlanSeasonInterface {
    name: string;
    code: string;
    periods: [
      {
        beginSellDate: { type: Date; required: true };
        endSellDate: { type: Date; required: true };
        weekdays: {
          type: [string];
          enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          required: true;
        };
      },
    ];
    propertyId: string;
    repeatType: string;
    isActive: boolean;
}

export interface RatePlanSeasonInterface extends CreateRatePlanSeasonInterface {
    id: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}