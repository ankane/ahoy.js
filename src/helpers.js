import { config } from './config';
import Cookies from './cookies';

export function setCookie(name, value, ttl) {
  Cookies.set(name, value, ttl);
};

export function getCookie(name) {
  return Cookies.get(name);
}

export function destroyCookie(name) {
  Cookies.set(name, "", -1);
}

export function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browser = "Unknown";
  if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edge") === -1) {
    browser = "Chrome";
  } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
    browser = "Safari";
  } else if (userAgent.indexOf("Firefox") > -1) {
    browser = "Firefox";
  } else if (userAgent.indexOf("Edge") > -1) {
    browser = "Edge";
  } else if (userAgent.indexOf("MSIE") > -1 || !!document.documentMode) {
    browser = "Internet Explorer";
  }
  return browser;
}

export function getOSAndVersion() {
  const userAgent = navigator.userAgent;
  let os = "Unknown";
  let version = "Unknown";

  if (userAgent.indexOf("Win") > -1) {
    os = "Windows";
    const match = userAgent.match(/Windows NT ([0-9.]+)/);
    if (match && match[1]) {
      version = match[1];
    }
  } else if (userAgent.indexOf("Mac") > -1) {
    os = "MacOS";
    const match = userAgent.match(/Mac OS X ([0-9_]+)/);
    if (match && match[1]) {
      version = match[1].replace(/_/g, '.');
    }
  } else if (userAgent.indexOf("X11") > -1) {
    os = "UNIX";
  } else if (userAgent.indexOf("Linux") > -1) {
    os = "Linux";
  }

  return { os, version };
}

export function getDeviceType() {
  const userAgent = navigator.userAgent;
  return /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";
}

export function generateId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
}

export function log(message) {
  if (getCookie("ahoy_debug")) {
    window.console.log(message);
  }
}

export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function visitsUrl() {
  return config.urlPrefix + config.visitsUrl;
}

export function eventsUrl() {
  return config.urlPrefix + config.eventsUrl;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function canTrackNow() {
  return (config.useBeacon || config.trackNow) && isEmpty(config.headers) && canStringify && typeof (window.navigator.sendBeacon) !== "undefined" && !config.withCredentials;
}

export function csrfToken() {
  const meta = document.querySelector("meta[name=csrf-token]");
  return meta && meta.content;
}

export function csrfParam() {
  const meta = document.querySelector("meta[name=csrf-param]");
  return meta && meta.content;
}

export function CSRFProtection(xhr) {
  const token = csrfToken();
  if (token) xhr.setRequestHeader("X-CSRF-Token", token);
}

export function matchesSelector(element, selector) {
  const matches = element.matches ||
    element.matchesSelector ||
    element.mozMatchesSelector ||
    element.msMatchesSelector ||
    element.oMatchesSelector ||
    element.webkitMatchesSelector;

  if (matches) {
    if (matches.apply(element, [selector])) {
      return element;
    } else if (element.parentElement) {
      return matchesSelector(element.parentElement, selector);
    }
    return null;
  } else {
    log("Unable to match");
    return null;
  }
}

export function getClosest(element, attribute) {
  for (; element && element !== document; element = element.parentNode) {
    if (element.hasAttribute(attribute)) {
      return element.getAttribute(attribute);
    }
  }

  return null;
}

export function onEvent(eventName, selector, callback) {
  document.addEventListener(eventName, function (e) {
    const matchedElement = matchesSelector(e.target, selector);
    if (matchedElement) {
      const skip = getClosest(matchedElement, "data-ahoy-skip");
      if (skip !== null && skip !== "false") return;

      callback.call(matchedElement, e);
    }
  });
}


// http://beeker.io/jquery-document-ready-equivalent-vanilla-javascript
export function documentReady(callback) {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    setTimeout(callback, 0);
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

export function page() {
  return config.page || window.location.pathname;
}

export function presence(str) {
  return (str && str.length > 0) ? str : null;
}

export function canStringify() {
  return typeof (JSON) !== "undefined" && typeof (JSON.stringify) !== "undefined";
}

export function cleanObject(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] === null) {
        delete obj[key];
      }
    }
  }
  return obj;
}
