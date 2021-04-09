# Ahoy.js

:fire: Visit and event tracking for JavaScript

- Easily track unique visitors
- Track events across page navigation

Use it with any backend. For Rails, check out the [Ahoy gem](https://github.com/ankane/ahoy).

## Installation

Install using npm:

```sh
npm install patient-discovery/ahoy.js
```

Include in your [project's dependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#github-urls):
```json
"dependencies": {
  "@patient-discovery/ahoy.js": "patient-discovery/ahoy.js"
}
```

And import it with:

```es6
import ahoy from '@patient-discovery/ahoy.js';
```

## How It Works

When someone lands on your website, they are assigned a visit token and a visitor token.

The visit token expires after 4 hours, in which a new visit is created.  Visits are useful for tracking metrics like monthly active users.  The visitor token expires after 2 years.  A `POST` request is sent to `/ahoy/visits` with:

- visit_token
- visitor_token
- referrer
- landing_page

The server can capture:

- ip
- user_agent
- user - from app authentication

And calculate things like:

- referring_domain and search_keyword from referrer
- utm_source, utm_medium, utm_term, utm_content, and utm_campaign from landing_page
- city, region, and country from ip
- browser, os, and device_type from user_agent

## Events

Track events with:

```javascript
ahoy.track(name, properties);
```

A `POST` request is sent to `/ahoy/events` with:

- name
- properties
- time

The server can capture:

- visit_token - from cookies
- user - from app authentication

As a precaution, the server should reject times that do not match:

```
1 minute ago < time <= now
```

### All Events

Track all views and clicks with:

```javascript
ahoy.trackAll();
```

Set the page with:

```javascript
ahoy.configure({page: "Landing page"});
```

And sections with:

```html
<div data-section="Header">
  <a href="/home">Home</a>
</div>
```

These are included in event properties if set.

### Views

```javascript
ahoy.trackView();
```

Name - `$view`

Properties

- url - `https://www.streamflip.com`
- title - `Streamflip`

### Clicks

```javascript
ahoy.trackClicks();
````

Name - `$click`

Properties

- tag - `a`
- id - `account-link`
- class - `btn btn-primary`
- text - `View Account`
- href - `/account`

Setting custom properties with `data-ahoy-click-` attributes:

```html
<a href="/my_product" data-ahoy-click-product-id="123" data-ahoy-click-cat="456">Extra</a>
```

Properties

- tag - `a`
- text - `Extra`
- href - `/my_product`
- properties - `{product_id: "123", cat: "456"}`

Setting custom properties from JSON with `data-ahoy-click-json` attribute:

```html
<a href="/my_product" data-ahoy-click-json="">Extra JSON</a>
```

<a data-ahoy-click-json="{&quot;some_flag&quot;:true,&quot;some_count&quot;:42}" href="/link">JSON</a>

Properties

- tag - `a`
- text - `JSON`
- href - `/link1`
- properties - `{some_flag: true, some_count: 42}`

JSON allows typing and nesting extra properties, but requires HTML escaping. HTML escaping is automatic in many templating systems like ERB.

### Submits

```javascript
ahoy.trackSubmits();
````

Name - `$submit`

### Changes

```javascript
ahoy.trackChanges();
````

Name - `$change`

## Development

Ahoy is built with developers in mind.  You can run the following code in your browser’s console.

Force a new visit

```javascript
ahoy.reset(); // then reload the page
```

Log messages

```javascript
ahoy.debug();
```

Turn off logging

```javascript
ahoy.debug(false);
```

## Configuration

Here’s the default configuration:

```javascript
ahoy.configure({
  urlPrefix: "",
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
  visitDuration: 4 * 60, // 4 hours
  visitorDuration: 2 * 365 * 24 * 60 // 2 years
});
```

When `trackVisits` is set to `false`, Ahoy.js will not attempt to create a visit
on the server, but assumes that the server itself will return visit and visitor
cookies.

### Subdomains

To track visits across multiple subdomains, use:

```javascript
ahoy.configure({cookieDomain: "yourdomain.com"});
```

### Users

Ahoy automatically associates users with visits and events if the user is authenticated on the server.

If you use cookies for authentication and the JavaScript library is on the same subdomain as the server, no additional configuration is needed.

If you use cookies and the JavaScript library is on a different domain or subdomain as the server, set:

```javascript
ahoy.configure({withCredentials: true});
```

This will [send credentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials) such as cookies, authorization headers or TLS client certificates to the server.

If you use headers for authentication, pass them with:

```javascript
ahoy.configure({headers: {"Authorization": "Bearer ..."}});
```

### Fetch

If you use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) to make requests and the JavaScript library is on a different domain or subdomain as the server, Ahoy cookies are not sent to the server by default. You can pass the info in headers with:

```javascript
fetch(url, {
  headers: {"Ahoy-Visit": ahoy.getVisitId(), "Ahoy-Visitor": ahoy.getVisitorId()}
});
```

## History

View the [changelog](https://github.com/ankane/ahoy.js/blob/master/CHANGELOG.md)

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/ankane/ahoy.js/issues)
- Fix bugs and [submit pull requests](https://github.com/ankane/ahoy.js/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features

To get started with development:

```sh
git clone https://github.com/ankane/ahoy.js.git
cd ahoy.js
npm install
npm build
```

## Testing

There are two types of tests you can run:

* jest unit tests (for cookies): `npm run test`
* zuul browser testing (ahoy functionality): `npm install zuul && npm run test:local`

Jest is the newer way of testing, and zuul has been deprecated.
