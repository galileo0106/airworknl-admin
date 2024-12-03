import { SERVER_URL } from "../apis";

export const getImageUrl = (path) => {
  return `${SERVER_URL}/${path}`;
};

export const toCapitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function formatDate(date) {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    // minute: "numeric",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}
