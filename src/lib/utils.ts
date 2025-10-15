import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// generate simple id
export const generateSimpleId = () =>
  Math.random().toString(16).slice(2).toString();

// generate a radom password
export const generateRandomPassword = (length: number = 10) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let res = "";
  // generate an array from the length
  for (let i = 0, n = charset.length; i < length; ++i) {
    res += charset.charAt(Math.floor(Math.random() * n));
  }
  return res;
};

// copy text to clipboard
export const copyTextToClipboard = (text?: string) => {
  if (window.navigator && text) {
    window.navigator.clipboard.writeText(text);
  }
};

// call a phone number
export const callPhoneNumber = (phonNumber?: string | number) => {
  // if there's no window obj return (SHOULD RUN JUST ON THE CLIENT SIDE)
  if (!window || !phonNumber) return;
  const ele = document.createElement("a");
  // set file like
  ele.href = `tel:${phonNumber}`;
  // click the link
  ele.click();
};

// download a file
export const downloadFile = async (url?: string, name?: string) => {
  // if there's no window obj return (SHOULD RUN JUST ON THE CLIENT SIDE)
  if (!window || !url || !name) return;
  // fetch the file from the link
  try {
    const file_res = await axios.get(url, {
      responseType: "blob", // file download
    });
    // create the blob
    const blob = new Blob([file_res.data]);
    const downloadUrl = window.URL.createObjectURL(blob);

    const ele = document.createElement("a");
    // set file like
    ele.href = downloadUrl;
    // download name
    ele.download = name;
    // security best practice
    ele.rel = "noopener noreferrer";
    // make it hidden
    ele.style.display = "hidden";
    // append to the body
    document.body.appendChild(ele);
    // click the link
    ele.click();
    // remove the element from the body after downloading
    document.body.removeChild(ele);
    // cleanup the ObjectURL
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.log("DOWNLOAD FILE ISSUE: ", err);
  }
};

// Crops the name to display in an avatar
export function getAvatarName(name: string): string {
  // Trim any leading or trailing whitespace
  const trimmedName = name?.trim() || 'Ayoub';

  // Split the name into parts by whitespace
  const nameParts = trimmedName.split(/\s+/);

  if (nameParts.length === 1) {
    // Single word: Use the first two letters
    return trimmedName.substring(0, 2).toUpperCase();
  } else {
    // Multiple words: Extract the first letter of each word
    const initials = nameParts.map((part) => part[0]).join("");
    return initials.toUpperCase();
  }
}
