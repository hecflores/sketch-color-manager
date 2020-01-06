var webpack = require("webpack");
const path = require("path")
module.exports = function (config, entry) {
  config.node = entry.isPluginCommand ? false : {
    setImmediate: false
  };
  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: 'ts-loader'
  });
  
  if (!config.resolve) {
    config.resolve = {
      extensions: [],
      modules:[]
    };
  }
  
  config.resolve.extensions = [...config.resolve.extensions, ".ts", ".tsx"];
  config.resolve.modules = [...config.resolve.modules, path.resolve(__dirname, 'src/mymodules')];
  

  config.module.rules.push({
    test: /\.(html)$/,
    use: [{
        loader: "@skpm/extract-loader",
      },
      {
        loader: "html-loader",
        options: {
          attrs: [
            'img:src',
            'link:href'
          ],
          interpolate: true,
        },
      },
    ]
  })
  config.module.rules.push({
    test: /\.(css)$/,
    use: [{
        loader: "@skpm/extract-loader",
      },
      {
        loader: "css-loader",
      },
    ]
  })

  config.plugins = [...config.plugins, new webpack.DefinePlugin({
    '__dirname': "'"+__dirname+"'",
    "require('fs')":'require("@skpm/fs")'
  })]
}
