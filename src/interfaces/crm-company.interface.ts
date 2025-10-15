// company size type (resource linkedin)
export type CompanySizeType =
  | "1"
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1001-5000"
  | "5001-10,000"
  | "10,001";

// the CRM Company interface

export default interface CRMCompanyInterface {
  createdAt: string | Date; // IOS Date
  updateAt: string | Date; // IOS Date
  id: string;

  //  main info
  info: {
    // name of the company
    name: string;
    // company size
    size: CompanySizeType;
    // company logo url
    logo: string;
    // description of the company
    description: string;
    // location
    location?: {
      country?: string;
      state?: string;
      city?: string;
      region: string;
      zipcode?: string;
      address?: string;
    };
  };

  // emails of company
  emails: string[];

  // phone numbers types (fax,mobile...)
  phoneNumbers: {
    mobile: string[]; // mobile phone numbers
    fax: string[]; // fax phone numbers
    whatsapp: string[]; // whatsapp phone numbers
    direct_line: string[]; // direct line numbers
    viber: string[]; // viber phone numbers
  };

  // the identification details of the company
  identificationDetails: {
    TIN: string; //  Tax Identification Number
    CRN: string; // Company Registration Number
    TAX_Code: string; // Tax Article
    Statistical_Code: string; // Statistical Identification Number
  };

  // social media accounts
  socialMedia: {
    website: string[]; // website of the company
    linkedin: string[]; // linkedin accounts
    facebook: string[]; // facebook accounts
    instagram: string[]; // instagram accounts
    youtube: string[]; // youtube accounts
    other: string[]; // other social media accounts
  };

  // work & department info
  category: string; // category the company
  industry: string;

  // resource (where the contact is founded e.x 'facebook','sm' )
  resource: string;
}

// the create CRM Company interface
export interface CreateCRMCompanyInterface {
  info: {
    name: string;
    size: CompanySizeType;
    logo: string;
    description: string;
    location?: {
      country?: string;
      state?: string;
      city?: string;
      region: string;
      zipcode?: string;
      address?: string;
    };
  };
  emails: string[];
  phoneNumbers: {
    mobile: string[];
    fax: string[];
    whatsapp: string[];
    direct_line: string[];
    viber: string[];
  };
  identificationDetails: {
    TIN: string;
    CRN: string;
    TAX_Code: string;
    Statistical_Code: string;
  };
  socialMedia: {
    website: string[];
    linkedin: string[];
    facebook: string[];
    instagram: string[];
    youtube: string[];
    other: string[];
  };
  category: string;
  industry: string;
  resource: string;
}
