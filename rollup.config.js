import buble from "@rollup/plugin-buble";
import pkg from "./package.json" with { type: "json" };
import terser from "@rollup/plugin-terser";

const banner =
`/*!
 * Ahoy.js v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 * ${pkg.license} License
 */
`;

const minBanner = `/*! Ahoy.js v${pkg.version} | ${pkg.license} License */`;

const input = "src/index.js";
const outputName = "ahoy";

export default [
  {
    input: input,
    output: {
      name: outputName,
      file: pkg.main,
      format: "umd",
      banner: banner
    },
    plugins: [
      buble()
    ]
  },
  {
    input: input,
    output: {
      name: outputName,
      file: "dist/ahoy.min.js",
      format: "umd",
      banner: minBanner
    },
    plugins: [
      buble(),
      terser()
    ]
  },
  {
    input: input,
    output: {
      file: pkg.module,
      format: "es",
      banner: banner
    },
    plugins: [
      buble()
    ]
  }
];
