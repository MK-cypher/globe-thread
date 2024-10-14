import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomId(length = 10) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function getDateNow() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hour}:${minute}`;
}

export function getTimeStampz() {
  const date = new Date(Date.now());

  const pad = (n: any) => (n < 10 ? "0" + n : n);

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // Months are zero-based
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = date.getUTCMilliseconds().toString().padStart(6, "0");

  const timestampZ = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;

  return timestampZ;
}

export const getDevice = (agent: string) => {
  if (agent.toLowerCase().includes("windows")) {
    return {device: "Windows", img: "/laptop.png"};
  }
  if (agent.toLowerCase().includes("linux")) {
    return {device: "Linux", img: "/linux.png"};
  }
  if (agent.toLowerCase().includes("phone")) {
    return {device: "Phone", img: "/phone.png"};
  } else {
    return {device: "Windows", img: "/laptop.png"};
  }
};

export const metaDataConfig = ({
  title = "globethread",
  description = "",
  image = "/logo.png",
  icons = "/favicon.ico",
  noIndex = false,
} = {}) => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{url: image}],
    },
    twitter: {
      title,
      description,
      images: [image],
      card: "summary_large_image",
    },
    icons,
    metadataBase: new URL("http://localhost:3000"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
};
