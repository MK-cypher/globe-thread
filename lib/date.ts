export const dayMonthYear = (originalDate: Date) => {
  const date = new Date(originalDate);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedDate;
};

export const getDayDateTime = (originalDate: Date) => {
  const date = new Date(originalDate);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(
    date
  );

  return `${formattedDate} - ${formattedTime}`;
};

export const getDateTime = (originalDate: Date) => {
  const date = new Date(originalDate);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(
    date
  );

  return `${formattedDate} - ${formattedTime}`;
};
