export const ddmmyyyyhm = (orignalDate: string) => {
  const date = new Date(orignalDate);

  const day = String(date.getDate()).padStart(2, "0");
  const monthShort = date.toLocaleString("en-US", {month: "short"});
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${monthShort}-${year} / ${hours}:${minutes}`;
};

export const ddmmyyyy = (orignalDate: string) => {
  const date = new Date(orignalDate);

  const day = String(date.getDate()).padStart(2, "0");
  const monthShort = date.toLocaleString("en-US", {month: "short"});
  const year = date.getFullYear();

  return `${day}-${monthShort}-${year}`;
};

export const hourminute = (orignalDate: string) => {
  const date = new Date(orignalDate);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const timeDif = (originalDate: string) => {
  const pastDate = new Date(originalDate);

  // Get the current time as a Date object
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMillis = currentDate.getTime() - pastDate.getTime();

  // Convert milliseconds to various time units
  const differenceInSeconds = Math.floor(differenceInMillis / 1000);
  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);
  const differenceInWeeks = Math.floor(differenceInDays / 7);

  let result;

  // Determine which unit to use for the output
  if (differenceInSeconds < 60) {
    result = `${differenceInSeconds} seconds ago`;
  } else if (differenceInMinutes < 60) {
    result = `${differenceInMinutes} minutes ago`;
  } else if (differenceInHours < 24) {
    result = `${differenceInHours} hours ago`;
  } else if (differenceInDays < 7) {
    result = `${differenceInDays} days ago`;
  } else {
    result = `${differenceInWeeks} weeks ago`;
  }

  return result;
};

export const msgDate = (timestampz: string) => {
  const date = new Date(timestampz);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const options: Intl.DateTimeFormatOptions = {hour: "numeric", minute: "numeric", hour12: true};
  const timeString = date.toLocaleString("en-US", options);

  if (date.toDateString() === now.toDateString()) {
    return `${timeString}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${timeString}`;
  } else {
    const dateOptions: Intl.DateTimeFormatOptions = {month: "2-digit", day: "2-digit", year: "numeric"};
    const dateString = date.toLocaleDateString("en-US", dateOptions);
    return `${dateString} ${timeString}`;
  }
};

export const dateSeperator = (timestampz: string) => {
  const date = new Date(timestampz);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return `Today`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday`;
  } else {
    const dateOptions: Intl.DateTimeFormatOptions = {month: "2-digit", day: "2-digit", year: "numeric"};
    const dateString = date.toLocaleDateString("en-US", dateOptions);
    return `${dateString}`;
  }
};

export const dayDifference = (timestamp1: string, timestamp2: string) => {
  //
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  return (
    date1.getUTCDate() !== date2.getUTCDate() ||
    date1.getUTCMonth() !== date2.getUTCMonth() ||
    date1.getUTCFullYear() !== date2.getUTCFullYear()
  );
};
