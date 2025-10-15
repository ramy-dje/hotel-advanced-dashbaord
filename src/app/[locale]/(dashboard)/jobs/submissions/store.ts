import JobSubmissionInterface from "@/interfaces/job-submission.interface";
import { create } from "zustand";

// The Job submissions Page store (with zustand)

interface StoreType {
  submissions_list: JobSubmissionInterface[];
  submissions_number: number;

  // actions
  set_many: (submissions: JobSubmissionInterface[]) => void;
  add_submission: (submission: JobSubmissionInterface) => void;
  remove_submission: (id: string) => void;
  remove_many_submissions: (ids: string[]) => void;
  update_submission: (id: string, submission: JobSubmissionInterface) => void;

  set_total: (num: number) => void;
}

const useJobSubmissionsStore = create<StoreType>((set) => ({
  submissions_list: [],
  submissions_number: 0,

  // set many
  set_many: (submissions) =>
    set(() => ({
      submissions_list: submissions,
    })),

  // actions
  add_submission: (submission) =>
    set((old) => ({
      submissions_list: [submission, ...old.submissions_list],
      submissions_number: old.submissions_number + 1,
    })),

  // remove submission
  remove_submission: (id) =>
    set((old) => ({
      submissions_list: old.submissions_list.filter((e) => e.id !== id),
      submissions_number: old.submissions_number - 1,
    })),

  // update submission
  update_submission: (id, submission) =>
    set((old) => ({
      submissions_list: old.submissions_list.map((e) =>
        e.id == id ? submission : e
      ),
    })),

  // remove many submissions
  remove_many_submissions: (ids) =>
    set((old) => ({
      submissions_list: old.submissions_list.filter((e) => !ids.includes(e.id)),
      submissions_number: old.submissions_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      submissions_number: num,
    })),
}));

export default useJobSubmissionsStore;
