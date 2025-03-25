# Yawl

Yawl is a simple and powerful JavaScript analytics solution, derived from a fork of [ahoy.js](https://github.com/ankane/ahoy.js) by Edulib. It allows you to track visits and other custom events on your website.

## Table of Contents

- [Yawl](#yawl)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Via npm](#via-npm)
    - [From the repository](#from-the-repository)
  - [Configuration](#configuration)
  - [Usage](#usage)
    - [Events](#events)
  - [Development](#development)

## Installation

### Via npm

```bash
npm install @edulib-france/yawl
```

### From the repository

Clone the repository and install the dependencies:

```
git clone https://github.com/edulib-france/yawl.git
cd yawl
npm install
```

## Configuration

`yawl.configure({ apiKey: 'your_api_key' })` must be called before tracking events.

## Usage

After configuration, you can initialize Yawl and track events on your site. For example, in your HTML file:

```
<!DOCTYPE html>
<html>
  <head>
    <title>Yawl Analytics</title>
    <script src="dist/yawl.js"></script>
    <script>
      // Initialize Yawl with your API key
      yawl.configure({ apiKey: 'your_api_key' });

      // Example of tracking a custom event
      yawl.track('New Event', {
        ean: 12323938432,
        establishment_account_id: 456,
        properties: {
          key: 'value'
        },
        time: '2023-10-01T12:00:00Z',
        user_type: 'student',
        visit_token: '789'
      });
    </script>
  </head>
  <body>
    <!-- Your HTML content -->
  </body>
</html>
```

### Events

The `yawl.track` function is used to track custom events on your website. It sends event data to the analytics backend for processing.

Here are the parameters for the `track` event:

| Parameter                  | Type     | Description                                 |
| -------------------------- | -------- | ------------------------------------------- |
| `ean`                      | Integer  | The article ID associated with the event.   |
| `establishment_account_id` | Integer  | The establishment account ID.               |
| `name`                     | String   | The name of the event (e.g., "click").      |
| `properties`               | Object   | Additional properties related to the event. |
| `time`                     | DateTime | The time of when the event occurred.        |
| `user_type`                | String   | The type of user (e.g., "client", "admin"). |
| `visit_token`              | String   | The token associated with the visit.        |

Example:

```javascript
yawl.track('New Event', {
  ean: 12323938432,
  establishment_account_id: 456,
  properties: {
    key: 'value',
  },
  time: '2023-10-01T12:00:00Z',
  user_type: 'student',
  visit_token: '789',
});
```

## Development

**Build Scripts**

The project uses Rollup to generate the bundles (UMD and ES Modules).

**Build**:
Generates the bundles in the dist/ folder.

**License**

This project is distributed under the [MIT](LICENSE.txt) license.
