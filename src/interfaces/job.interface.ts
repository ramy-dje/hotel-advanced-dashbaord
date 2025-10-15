// the job interface
export default interface JobInterface {
  title: string;
  type: string;
  expire: Date | string; // IOS Date
  positions: number;
  level: string;
  locations: {
    state: string;
    city: string;
    address: string;
  };
  department: {
    id: string;
    name: string;
  };
  description: string;
  responsibilities_text: string;
  desired_profile_text: string;
  skills_text: string;
  createdAt: string | Date;
  id: string;
}
// the create job interface
export interface CreateJobInterface {
  title: string;
  type: string;
  expire: Date | string;
  positions: number;
  level: string;
  locations: {
    state: string;
    city: string;
    address: string;
  };
  description: string;
  responsibilities_text: string;
  desired_profile_text: string;
  skills_text: string;
  department: string | null;
}
