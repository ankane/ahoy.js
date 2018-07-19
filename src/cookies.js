// https://www.quirksmode.org/js/cookies.html

export default {
  set: function (name, value, ttl, domain) {
    let expires = "";
    let cookieDomain = "";
    if (ttl) {
      let date = new Date();
      date.setTime(date.getTime() + (ttl * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    }
    if (domain) {
      cookieDomain = "; domain=" + domain;
    }
    document.cookie = name + "=" + escape(value) + expires + cookieDomain + "; path=/";
  },
  get: function (name) {
    let i, c;
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (i = 0; i < ca.length; i++) {
      c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return unescape(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }
};
