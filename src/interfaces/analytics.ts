// Analytics interfaces

// Room analytics interface
export interface RoomAnalyticsInterface {
  // number of rooms analytics
  rooms_number: number;

  // delete rooms
  rooms_deleted_number: number;

  // most reserved rooms (limited to 5 rooms)
  rooms_reserved_number: {
    reservations: number;
    category: string;
    id: string;
    title: string;
  }[];
}

// Reservations analytics interface
export interface ReservationsAnalyticsInterface {
  // number of tody's reservations
  reservations_tody_number: number;

  // reservations number by period of time // (last month,last week and yesterday)
  reservations_by_period_number: {
    yesterday_number: number;
    today_number: number;
    week_number: number;
    month_number: number;
  };

  // reservations number by days // (30 days back)
  reservations_by_days_number: {
    date: Date;
    reservations: number;
  }[];
  // number of reservations
  reservations_total_number: number;

  // number of reservations canceled
  reservations_canceled: number;

  // number of reservations completed
  reservations_completed: number;

  // number of reservations pending
  reservations_pending: number;

  // number of reservations deleted
  reservations_deleted: number;

  // number of reservations approved
  reservations_approved: number;
}

// Blogs analytics interface
export interface BlogsAnalyticsInterface {
  // number of blogs
  blogs_number: number;

  // blogs number by period of time // (// (last month,last week and yesterday, today)
  blogs_by_period_number: {
    yesterday_number: number;
    today_number: number;
    week_number: number;
    month_number: number;
  };
}

// Destinations analytics interface
export interface DestinationsAnalyticsInterface {
  // number of destinations
  destinations_number: number;

  // destinations number by period of time // (last month,last week and last day,tody)
  destinations_by_period_number: {
    yesterday_number: number;
    today_number: number;
    week_number: number;
    month_number: number;
  };
}

// Jobs analytics interface
export interface JobsAnalyticsInterface {
  submissions_total_number: number;
  submissions_job_total_number: number;
  submissions_free_total_number: number;

  // submissions job number by period of time // (last month,last week and last day,tody)
  submissions_job_by_period_number: {
    yesterday_number: number;
    today_number: number;
    week_number: number;
    month_number: number;
  };

  // submissions free number by period of time // (last month,last week and last day,tody)
  submissions_free_by_period_number: {
    yesterday_number: number;
    today_number: number;
    week_number: number;
    month_number: number;
  };
}

// CRM analytics interface
export interface CRMContactAnalyticsInterface {
  // total contacts number
  contacts_total_number: number;

  // tody contact number
  contacts_tody_number: number;

  // contacts number by period of time // (last month,last week and last day,tody)
  contacts_by_period_number: {
    yesterday_number: number;
    today_number: number;
    week_number: number;
    month_number: number;
  };

  // top countries contacts (limited to 5 countries)
  contacts_top_countries: {
    country: string;
    contacts: number;
  }[];

  // top industries contacts (limited to 5 industries)
  contacts_top_industries: {
    industry: string;
    contacts: number;
  }[];

  // top occupations contacts (limited to 5 occupations)
  contacts_top_occupations: {
    occupation: string;
    contacts: number;
  }[];

  // inserted contacts number
  contacts_inserted_numbers: {
    website: number;
    dashboard: number;
  };
}

// CRM company analytics interface
export interface CRMCompanyAnalyticsInterface {
  // total companies number
  companies_total_number: number;

  // tody contact number
  companies_tody_number: number;

  // companies number by period of time // (last month,last week and last day,tody)
  companies_by_period_number: {
    yesterday_number: number;
    today_number: number;
    week_number: number;
    month_number: number;
  };

  // top countries companies (limited to 5 countries)
  companies_top_countries: {
    country: string;
    companies: number;
  }[];

  // top sizes companies (limited to 5 sizes)
  companies_top_sizes: {
    size: string;
    companies: number;
  }[];

  // top regions companies (limited to 5 regions)
  companies_top_regions: {
    region: string;
    companies: number;
  }[];

  // top industries companies (limited to 5 industries)
  companies_top_industries: {
    industry: string;
    companies: number;
  }[];

  // top categories companies (limited to 5 categories)
  companies_top_categories: {
    category: string;
    companies: number;
  }[];
}
