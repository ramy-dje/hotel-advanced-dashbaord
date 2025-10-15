"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import JobSubmissionInterface from "@/interfaces/job-submission.interface";
import {
  callPhoneNumber,
  copyTextToClipboard,
  downloadFile,
} from "@/lib/utils";
import { DateTime } from "luxon";
import {
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineDocumentDuplicate,
  HiOutlineDownload,
  HiOutlinePhone,
  HiOutlinePhoneOutgoing,
  HiOutlineUser,
} from "react-icons/hi";
import { BsFiletypePdf } from "react-icons/bs";
import toast from "react-hot-toast";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  data: JobSubmissionInterface | null;
}

export default function ReviewJobSubmissionPopup({
  data,
  open,
  setOpen,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="lg:max-w-[22em] min-h-[22em]"
      >
        {" "}
        <div className="w-full h-full flex flex-col gap-6 justify-between">
          <DialogHeader>
            <DialogTitle>Position Submission</DialogTitle>
          </DialogHeader>
          <div className="w-full flex text-base flex-col gap-2">
            <div className="flex justify-between items-center gap-2 px-2 py-1 rounded-md ">
              <div className="flex items-center gap-4">
                <HiOutlineUser className="size-6 text-primary" />{" "}
                <span className="font-semibold text-foreground">
                  {data?.fullName}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyTextToClipboard(data?.fullName)}
                className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
              >
                <HiOutlineDocumentDuplicate className="size-4" />
              </Button>
            </div>
            {/* phone number */}
            <div className="flex justify-between items-center gap-2 px-2 py-1 rounded-md ">
              <div className="flex items-center gap-4">
                <HiOutlinePhone className="size-6 text-primary" />{" "}
                <span className="font-semibold text-foreground">
                  {data?.phoneNumber}
                </span>
              </div>

              <Button
                onClick={() => copyTextToClipboard(data?.phoneNumber)}
                variant="outline"
                size="icon"
                className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
              >
                <HiOutlineDocumentDuplicate className="size-4" />
              </Button>
            </div>
            {/* cv */}
            <div className="flex justify-between items-center gap-2 px-2 py-1 rounded-md ">
              <div className="flex items-center gap-4">
                <BsFiletypePdf className="size-6 text-primary" />{" "}
                <a
                  href={data?.cv_url}
                  target="_blank"
                  className="font-semibold text-sm text-primary line-clamp-1 hover:underline"
                >
                  {data?.cv_url.slice(0, 24)}...
                </a>
              </div>

              <Button
                onClick={() => copyTextToClipboard(data?.cv_url)}
                variant="outline"
                size="icon"
                className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
              >
                <HiOutlineDocumentDuplicate className="size-4" />
              </Button>
            </div>
            {/* job title */}
            <div className="flex justify-between items-center gap-2 px-2 py-1 rounded-md ">
              <div className="flex items-center gap-4">
                <HiOutlineBriefcase className="size-6 text-primary" />{" "}
                <span className="font-semibold text-foreground">
                  {data?.job?.title || "/"}
                </span>
              </div>
            </div>
            {/* submitted date */}
            <div className="flex justify-between items-center gap-2 px-2 py-1 rounded-md ">
              <div className="flex items-center gap-4">
                <HiOutlineCalendar className="size-6 text-primary" />{" "}
                <span className="font-semibold text-foreground">
                  {DateTime.fromISO(data?.createdAt as string).toFormat(
                    "MM-dd-yyyy"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* the footer */}
          <DialogFooter className="justify-between gap-2">
            <Button
              onClick={() => {
                setOpen(false);
                toast.promise(
                  downloadFile(data?.cv_url, data?.fullName + "-cv.pdf"),
                  {
                    loading: "Downloading...",
                    success: <span>CV Downloaded!</span>,
                    error: <span>Downloading Failed</span>,
                  }
                );
              }}
              className="w-full gap-2"
            >
              Download CV
              <HiOutlineDownload className="size-4" />
            </Button>
            <Button
              onClick={() => {
                callPhoneNumber(data?.phoneNumber);
              }}
              className="w-full gap-2"
              variant="outline"
            >
              Call Phone <HiOutlinePhoneOutgoing className="size-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
