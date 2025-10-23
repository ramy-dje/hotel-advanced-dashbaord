/* ────────────────────────────────────────────────
 * DEALS & OFFERS
 * ────────────────────────────────────────────── */

export enum OfferType {
  BXGY = 'bxgy', // buy X get Y
  PACKAGE = 'package', // package
  ORDER_AMOUNT = 'order_amount', // order amount
  PRODUCTS_AMOUNT = 'products_amount', // products amount
}
export enum OfferMethod {
  CODE = 'code', // code
  DISCOUNT = 'auto', // discount
}
export enum BxgyType {
  PURSHASE_AMOUNT = 'purchase_amount', // purchase amount
  QUANTITY_AMOUNT = 'quantity_amount', // quantity amount
}

export interface OfferInterface {
  //offer main informations
  type: OfferType;
  name: string; 
  image?: string;
  image_url?: string;
  method: OfferMethod; 
  code?: string; 
  description?: string; 
  isRefundable: boolean;
  //buy X get Y data
  bxgy?:{
    type:BxgyType;
    buyItems: {
      itemType:string;
      quantity:string;
      itemId:string;
      selectedItems?:{
        itemId:string;
      }[];
    }[]; // e.g. must buy 2 nights at minimum
    getItems: {
      itemType:string;
      quantity:string;
      selectedItems?:{
        itemId:string;
      }[];
    }[]; // e.g. get 1 night for 
    discountType:string;
    discountValue:number;
    maxUsage?:number;
    hasMaxUsage?:boolean;
  }
  // for purshase amount discount and order amount discounts
  discount?: {
    amount: number;
    type: string;
    hasMaxUsage?: boolean;
    maxUsage?: number;
    eligibleRooms?:{
      roomId:string;
      roomRateId:string;
    }[];
    isOnePerUser?: boolean;
  };
  //package data
  package?:{
    items: {
      type:string;
      quantity:string;
      selectedItems?:{
        itemId:string;
      }[];
    }[]; // e.g. get 1 night for 
    costType:string;
    costValue:number;
    costPer:string;
    taxIncluded:boolean;
    taxValue:number;
  }
  //validity time informations
  timeValidity?:{
    startDate: Date;
    startTime?: string;
    hasEndDate?: boolean;
    endDate?: Date;
    endTime?: string;
  }
  //offer requirements
  requirements:{
    type:BxgyType;
    minTotalSpend?: number; // e.g. min 3 nights
    minPurchaseAmount?: number; // e.g. min 3 nights 
  }
  //offer eligibility
  eligibility?:{
    type?: string;
    segments?: string[];
    client?: string[];
  }
  //offer policies
  combinations?: string[]; // can combine with other deals
  policies?: string;
  benefits?: string;
  //offer status
  isActive?: boolean; // is it working

}

export interface Client_OfferInterface extends OfferInterface {
  createdAt: string | Date; // IOS Date
  id: string;
}
