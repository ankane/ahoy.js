var csrfMetaTag = document.createElement('meta');
csrfMetaTag.name = 'csrf-param';
csrfMetaTag.content = 'authenticity_token';
document.getElementsByTagName('head')[0].appendChild(csrfMetaTag);

var tokenMetaTag = document.createElement('meta');
tokenMetaTag.name = 'csrf-token';
tokenMetaTag.content = 'test-token-abcdef123456';
document.getElementsByTagName('head')[0].appendChild(tokenMetaTag);

ahoy.configure({ startOnReady: false, trackNow: false });
