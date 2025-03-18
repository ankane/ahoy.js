# Yawl

Yawl is a simple and powerful JavaScript analytics solution, derived from a fork of [ahoy.js](https://github.com/edulib-france/yawl) by Edulib. It allows you to track visits and other custom events on your website.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Build Scripts](#build-scripts)
- [License](#license)

## Installation

### Via npm

**_TO DO (update according to the package name)_**

```bash
npm install yawl
```

**From the repository**

Clone the repository and install the dependencies:

```
git clone https://github.com/edulib-france/yawl.git
cd yawl
npm install
```

**Configuration**

The default configuration is located in the file src/config.js. In this file you will find, among other things:

• **urlPrefix**: The URL prefix for sending visits and events.

By default, it is defined based on the environment:

• https://staging.edulib.fr for the development/staging environment.

• https://production.edulib.fr for the production environment.

**Usage**

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

**Build Scripts**

The project uses Rollup to generate the bundles (UMD and ES Modules). The scripts defined in package.json include:

• **Build**:

Generates the bundles in the dist/ folder.

**Production**

```
npm run build
```

**Development**

```
npm run build:dev
```

• **Lint**:

Checks the code with ESLint.

```
npm run lint
```

**License**

This project is distributed under the [MIT](LICENSE.txt) license.
