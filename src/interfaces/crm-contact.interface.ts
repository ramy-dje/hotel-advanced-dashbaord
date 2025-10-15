// the CRM Contact interface
export default interface CRMContactInterface {
  createdAt: string | Date; // IOS Date
  updateAt: string | Date; // IOS Date
  id: string;

  // the personal info the contact
  personalInfo: {
    firstName: string;
    lastName: string;
    gender: "male" | "female";
    pic: string; // pic of the contact
    location: {
      country?: string;
      state?: string;
      city?: string;
      address?: string;
      zipcode?: string;
    };
  };

  // bio of the contact
  bio: string;

  // emails of hte user
  emails: string[];

  // work & industry
  work: {
    industry?: string;
    occupation?: string;
    company?: string; // of company of the contact
  };

  // phone numbers types (fax,mobile...)
  phoneNumbers: {
    mobile: string[]; // mobile phone numbers
    fax: string[]; // fax phone numbers
    whatsapp: string[]; // whatsapp phone numbers
    viber: string[]; // viber phone numbers
  };

  // social media accounts
  socialMedia: {
    facebook: string[]; // facebook accounts
    instagram: string[]; // instagram accounts
    telegram: string[]; // telegram accounts links
    youtube: string[]; // youtube accounts
    linkedin: string[]; // linkedin accounts
    twitter: string[]; // twitter/x accounts
    tiktok: string[]; // tiktok accounts
    pinterest: string[]; // pinterest accounts
    snapchat: string[]; // snapchat accounts
    reddit: string[]; // reddit accounts
    twitch: string[]; // twitch accounts
    other: string[]; // other social media accounts
  };
  // resource (where the contact is founded e.x 'facebook','sm' )
  resource: string;
  // insertedBy (where the contact was created (enum 'website' | 'dashboard') )
  insertedBy: "website" | "dashboard";

  access: {
    createdAt: string | Date;
    id: string;

    // main info
    profileInfo: {
      pic: string;
      username: string;
      email: string;
      fullName: string;
      phoneNumber?: string[];
      location?: {
        country?: string;
        state?: string;
        city?: string;
        zipcode?: string;
      };
      gender: "male" | "female";
    };

    // access/auth info
    access: {
      role: {
        id: string;
        name: string;
        color: string;
      };
      active: boolean;
      isAdmin: boolean;
    };
  } | null;
}

// the create CRM Contact interface
export interface CreateCRMContactInterface {
  personalInfo: {
    firstName: string;
    lastName: string;
    gender: "male" | "female";
    pic: string;
    location: {
      country?: string;
      state?: string;
      city?: string;
      address?: string;
      zipcode?: string;
    };
  };
  bio: string;
  emails: string[];
  work: {
    industry?: string | null;
    occupation?: string | null;
    company?: string | null;
  };
  phoneNumbers: {
    mobile: string[];
    fax: string[];
    whatsapp: string[];
    viber: string[];
  };
  socialMedia: {
    facebook: string[]; // facebook accounts
    instagram: string[]; // instagram accounts
    telegram: string[]; // telegram accounts links
    youtube: string[]; // youtube accounts
    linkedin: string[]; // linkedin accounts
    twitter: string[]; // twitter/x accounts
    tiktok: string[]; // tiktok accounts
    pinterest: string[]; // pinterest accounts
    snapchat: string[]; // snapchat accounts
    reddit: string[]; // reddit accounts
    twitch: string[]; // twitch accounts
    other: string[]; // other social media accounts
  };
  access?: string | null; // user id
  resource: string;
}
