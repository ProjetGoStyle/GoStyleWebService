const path = require("path");
const nodeExternals = require("webpack-node-externals");

//const server_port = process.env.MY_PORT || process.env.PORT || 5000;
//const server_host = process.env.MY_HOST || "0.0.0.0";

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
