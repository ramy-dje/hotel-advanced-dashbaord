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

export function getTextColorByContrast(bgColor: string): string {
  if (bgColor.startsWith("#")) {
    bgColor = bgColor.slice(1);
  }

  if (bgColor.length === 3) {
    bgColor = bgColor
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(bgColor.slice(0, 2), 16) / 255;
  const g = parseInt(bgColor.slice(2, 4), 16) / 255;
  const b = parseInt(bgColor.slice(4, 6), 16) / 255;

  // Visual preference override: white text looks better on vibrant backgrounds
  const hsp = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);

  // If background is dark (hsp < 0.65), use white text
  if (hsp < 0.85) {
    return "white";
  }

  return "#252728";
}

//percent values range from 0 to 100 where 0 is the darkest and 100 is the lightest
export function lightenHexColor(hex: string, percent = 60) {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Increase each component by the percent, but cap at 255
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  // Convert back to hex and pad with 0s if needed
  const toHex = (c: any) => c.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

type MealPlan = "RO" | "BB" | "HB" | "FB" | "DO" | "LO" | "AI" | string;
export const detectMealPlan = (meals: string[]): MealPlan => {
  const normalized = meals.map((m) => m.toLowerCase()).sort();
  const has = (meal: string) => normalized.includes(meal);
  const only = (...list: string[]) =>
    normalized.length === list.length &&
    list.every((item) => normalized.includes(item));
  if (only("room only")) return "RO";
  if (only("breakfast")) return "BB";
  if (only("lunch")) return "LO";
  if (only("dinner")) return "DO";
  if (meals.length === 2) return "HB"; // Half board
  if (meals.length === 3) return "FB"; // Full board
  if (meals.length === 4) return "AI"; // All Inclusive
  return "Custom";
};

export const getMealsFromCode = (
  code: string,
): { label: string; bgColor: string } => {
  const map: Record<string, { label: string; bgColor: string }> = {
    RO: { label: "Room Only", bgColor: "#FFC107" }, // vibrant amber
    BB: { label: "Bed & Breakfast", bgColor: "#00BFA5" }, // strong teal
    LO: { label: "Lunch Only", bgColor: "#EC407A" }, // vivid pink
    DO: { label: "Dinner Only", bgColor: "#42A5F5" }, // medium blue
    HB: { label: "Half Board", bgColor: "#FF9800" }, // deep orange
    FB: { label: "Full Board", bgColor: "#66BB6A" }, // vivid green
    AI: { label: "All Inclusive", bgColor: "#AB47BC" }, // rich purple
  };

  return (
    map[code.toUpperCase()] || {
      label: "Custom",
      bgColor: "#9E9E9E", // darker neutral gray for white text
    }
  );
};

export function generateCode(nameController: string): string {
  const name = nameController.trim();
  if (!name || name.length === 0) return "";
  const prefix = name.substring(0, Math.min(3, name.length)).toUpperCase();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const generatedCode = `${prefix}${randomNum}`;
  return generatedCode;
}

export function calculateTotal(
  tierTable: any,
  taxCalculationFactor: string,
  maxStay?: number,
) {
  if (!tierTable || !taxCalculationFactor) return 0;
  const extraPrice = tierTable.extraOccupants.reduce(
    (acc: number, extra: number) => {
      return acc + extra;
    },
    0,
  );
  const lastTier = tierTable.tiers.length > 1 ? tierTable.tiers.length - 1 : 0;

  if (taxCalculationFactor === "PER_GUEST_PER_DAY") {
    if (!maxStay) return 0;

    const solidPrice =
      tierTable.tiers[lastTier].baseRates.adult *
        tierTable.tiers[lastTier].baseOccupants.adult +
      tierTable.tiers[lastTier].baseRates.child *
        tierTable.tiers[lastTier].baseOccupants.child;
    const total = solidPrice + extraPrice;
    return total;
  }
  if (taxCalculationFactor === "PER_ACC_PER_DAY") {
    if (!maxStay) return 0;
    const solidPrice = tierTable.tiers[lastTier].baseRates.adult + tierTable.tiers[lastTier].baseRates.child;
    const total = solidPrice + extraPrice;
    return total;
  }
  if (taxCalculationFactor === "PER_ACC") {
    const solidPrice = tierTable.tiers[lastTier].baseRates.adult + tierTable.tiers[lastTier].baseRates.child;
    const total = solidPrice + extraPrice;
    return total;
  }
  return 0;
}
