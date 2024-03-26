## 0.4.4 (2024-03-26)

- Improved UUID generation

## 0.4.3 (2023-03-11)

- Fixed `exports`

## 0.4.2 (2023-02-23)

- Fixed error with `visitParams`

## 0.4.1 (2023-02-07)

- Added support for `data-ahoy-skip` attribute

## 0.4.0 (2021-08-14)

- Required `selector` for `trackClicks`, `trackSubmits`, and `trackChanges`
- Removed `trackAll` method
- Fixed `SameSite` cookie warning

## 0.3.9 (2021-08-13)

- Added `selector` for `trackClicks`, `trackSubmits`, and `trackChanges`
- Deprecated `trackAll` and `trackChanges`
- Removed dependency on object-to-formdata

## 0.3.8 (2020-12-04)

- Fixed `trackClicks` for nested elements

## 0.3.7 (2020-07-06)

- Added support for object-to-formdata 4.0

## 0.3.6 (2020-06-07)

- Added `visitDuration` and `visitorDuration` options
- Added `ready` function

## 0.3.5 (2020-04-16)

- Support `configure` after document is loaded
- Fixed error with jQuery slim

## 0.3.4 (2019-02-18)

- Added `headers` option
- Added `visitParams` option
- Added `withCredentials` option

## 0.3.3 (2018-05-18)

- Added `cookies` option

## 0.3.2 (2018-03-25)

- Fixed module build

## 0.3.1 (2018-03-14)

- Better handling of visit expiration in JavaScript
- Wait for successful response to destroy `ahoy_track` cookie
- Better compatibility with older browsers

## 0.3.0 (2018-02-25)

- Removed jQuery dependency
- Use `navigator.sendBeacon` by default in supported browsers
- Removed support for IE < 9
- Removed support for Bower

## 0.2.1 (2017-01-22)

- Fixed issue with duplicate events

## 0.2.0 (2016-11-13)

- Added `configure` function
- Added `getVisitToken` and `getVisitorToken` functions
- Added `visitsUrl` and `eventsUrl` options

## 0.1.0 (2015-08-06)

- First versioned release
