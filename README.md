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

`yawl.configure('api-key')` must be called before tracking events.

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
      yawl.configure('your_api_key');

      // Example of tracking a custom event
      yawl.track("click", {
        article_id: 69,
        establishment_account_id: 109,
        name: 'test',
        user_type: 'client'
      });
    </script>
  </head>
  <body>
    <!-- Your HTML content -->
  </body>
</html>
```

## Development

**Build Scripts**

The project uses Rollup to generate the bundles (UMD and ES Modules).

**Build**:
Generates the bundles in the dist/ folder.

**License**

This project is distributed under the [MIT](LICENSE.txt) license.
