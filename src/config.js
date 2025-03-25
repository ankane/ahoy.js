export const config = {
  urlPrefix: "https://staging.edulib.fr",
  visitsUrl: "/ahoy/visits",
  eventsUrl: "/ahoy/events",
  page: null,
  platform: "Web",
  useBeacon: true,
  startOnReady: true,
  trackVisits: true,
  cookies: true,
  cookieDomain: null,
  headers: {},
  visitParams: {},
  withCredentials: false,
  visitDuration: 4 * 60, // default 4 hours
  visitorDuration: 2 * 365 * 24 * 60, // default 2 years
};
