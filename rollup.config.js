import buble from "@rollup/plugin-buble";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json" with { type: "json" };
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const banner =
`/*!
 * yawl v${pkg.version}
 * ${pkg.description}
 * ${pkg.repository.url}
 * ${pkg.license} License
 */
`;

const minBanner = `/*! yawl v${pkg.version} | ${pkg.license} License */`;

const input = "src/index.js";
const outputName = "yawl";

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
      resolve(),
      commonjs(),
      buble()
    ]
  },
  {
    input: input,
    output: {
      name: outputName,
      file: "dist/yawl.min.js",
      format: "umd",
      banner: minBanner
    },
    plugins: [
      resolve(),
      commonjs(),
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
