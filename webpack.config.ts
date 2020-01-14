const path = require("path");
const nodeExternals = require("webpack-node-externals");


module.exports = {
  mode: "development",
  entry: "./src/server.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  target: "node",
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".js", ".ts"]
  }
};
