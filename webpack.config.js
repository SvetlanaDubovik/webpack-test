//basic vars
const path = require('path');
const webpack = require('webpack');

//additional plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ExtractTextPlugin = require('extract-text-webpack-plugin');


//для винды в package json в production нужно писать 'set NODE_ENV=production && webpack'
//Иначе будет ругаться на NODE_ENV
var PRODUCTION = process.env.NODE_ENV === "production";
var isProduction = (PRODUCTION === true);

//module settings 
module.exports = {
  //basic path to project
  context: path.resolve(__dirname, 'src'),
  
  //entry JS
  entry: {
    app: [
      './js/app.js',
      './scss/style.scss'
    ],
  },
  
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '../'
  },
  
  //devServer configuration
  devServer: {
    contentBase: './app'
  },
  
  devtool: (isProduction) ? '' : 'inline-source-map',
  
  module: {
    rules: [
      //scss
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {sourceMap: true}
            },
            {
              loader: 'postcss-loader',
              options: {sourceMap: true}
            },
            {
              loader: 'sass-loader',
              options: {sourceMap: true}
            }
          ],
          fallback: 'style-loader',
        })
      },
      
      // img
      {
        test: /\.(png|gif|jpe?g)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            }
          },
          'img-loader',
        ]
      },
      
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            }
          },
        ]
      },
      
      // SVG
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
      },
    ],
  },
  
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(PRODUCTION)
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery'
    }),
    new ExtractTextPlugin(
      './css/[name].css'
    ),    
    new CleanWebpackPlugin(['dist']),    
    new CopyWebpackPlugin(
      [
        {from: './img', to: 'img'}
      ],
      //чтобы не копировались svg. Из потом совй loader преобразует в текстовый вид
      {
        ignore: [
          {glob: 'svg/*'},
        ]
      }
    ),
  ],
};

//PRODUCTION ONLY

if(isProduction) {
  module.exports.plugins.push(
    new UglifyJSPlugin({
      sourceMap: true
    })
  );
  
  module.exports.plugins.push(
    new ImageminPlugin({
      test: /\.(png|jpe?g|gif|svg)$/
    })
  );
  
  module.exports.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  );
  
  
}