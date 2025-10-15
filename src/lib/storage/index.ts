import axiosAPI from "../axios";

// Preassigned req body type
interface PreassignedLinkBodyType {
  size: number;
  name: string;
  usage:
    | "profile"
    | "contact-profile"
    | "company-logo"
    | "room-gallery"
    | "room-image"
    | "blog-image"
    | "dish-image"
    | "destination-image";
  type: "image/jpg" | "image/jpeg" | "image/png";
}

interface PreassignedLinkRes {
  preassigned_url: string;
  public_url: string;
}

// storage

// GenerateUploadLink
export async function GenerateUploadLink(
  file: File,
  usage: PreassignedLinkBodyType["usage"]
) {
  const body: PreassignedLinkBodyType = {
    name: file.name,
    size: file.size,
    usage,
    type: file.type as any,
  };

  try {
    const res = await axiosAPI.post<PreassignedLinkRes>(
      "storage/upload-image-preassigned",
      body
    );

    return res.data;
  } catch (err) {
    console.log("Storage: ", err);
    throw new Error(
      "Storage (Generate Preassigned Link Err): Something went wrong"
    );
  }
}

// Upload file
export async function UploadFileViaPreassignedURL(
  file: File,
  preassigned_url: string,
  public_url: string
) {
  try {
    // file
    await axiosAPI.request({
      method: "put",
      data: file,
      withCredentials: false,
      headers: {
        "Content-Type": file.type,
      },
      url: preassigned_url,
    });
    return public_url;
  } catch (err) {
    console.log("Upload Storage: ", err);
    throw new Error("Upload Storage (Upload File Err): Something went wrong");
  }
}

// UploadFile
export async function UploadFile(
  file: File,
  usage: PreassignedLinkBodyType["usage"]
) {
  try {
    // generate preassigned url
    const urls = await GenerateUploadLink(file, usage);
    // upload the file
    const public_url = await UploadFileViaPreassignedURL(
      file,
      urls.preassigned_url,
      urls.public_url
    );
    // return the url
    return public_url;
  } catch (err) {
    throw err;
  }
}

// Upload many files

export async function UploadManyFiles(
  files: File[],
  usage: PreassignedLinkBodyType["usage"]
) {
  const public_urls = [];
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const public_url = await UploadFile(file, usage);
      if (public_url) {
        public_urls.push(public_url);
      }
    }
    // return the public urls
    return public_urls;
  } catch (err) {
    throw err;
  }
}
