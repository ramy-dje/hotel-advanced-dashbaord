// the job department interface
export default interface JobSubmissionInterface {
  fullName: string;
  phoneNumber: string;
  cv_url: string;
  job: {
    title: string;
    id: string;
  } | null;
  createdAt: string | Date; // IOS Date
  id: string;
}
// the create job submission interface
export interface CreateJobSubmissionInterface {
  fullName: string;
  phoneNumber: string;
  cv_url: string;
  job: string;
}
