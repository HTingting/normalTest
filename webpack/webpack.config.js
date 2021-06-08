const path = require('path');

const htmlWebpackPlugin = require('html-webpack-plugin')
const { cleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode:'development',
    devtool:false, /*soucemap帮助更好的定位  dist/bundle.js ---> src/index.js */
    //devtool:'eval-sourc-map', /**/
    //devtool:'source-map', /**/
    /*eval-cheep-module-source-map*/ /*cheap-source-map*/
    //入口
    //entry: './src/index.js',
    entry: {
      test: './src/index.js',
        sub:'./src/index.js'
    },
    /*output: {
        path: path.resolve(__dirname,'dist'),
        name:'main.js'
    }*/
    output: {
        publicPath: '',  //可以是cdn地址
        path: path.resolve(__dirname,'dist'),
        name:'[name].js'
    },
    module:{
        rules:[
            {
                test:/.(jpg|png|gif)$/,
                use: {
                    loader:'file-loader',
                    options: {
                        name: '[name].[ext]',  /*希望与原来的图片名称一直，不然默认是hash值*/
                        outputPath: 'images/'
                    }
                }
            },
            {
                test:/.(eot|svg|ttf)$/,
                use: {
                    loader:'file-loader',
                }
            },
            //url-loader打包图片
            {
                test:/.(jpg|png|gif)$/,
                use: {
                    loader:'url-loader',
                    options: {
                        name: '[name]_[hash].[ext]',  /*希望与原来的图片名称一直，不然默认是hash值*/
                        outputPath: 'images/',
                        limit: 400*1024 /*小于才打包成base64*/
                    }
                }
            },
            // css-loader，style-loader
            {
                test:/.css$/,
                //数组是从下往上执行
                use:[
                    'style-loader', /*内置styleb标签*/
                    'css-loader'  /*分析互相引用的关系*/
                ]
            },
            // sass-loader
            {
                test:/.sass$/,
                //数组是从下往上执行
                use:[
                    'style-loader',/*内置styleb标签*/
                    /*'css-loader',*/
                    {
                        loader:'css-loader',
                        options: {
                            modules: true /*css模块化*/
                        }
                    },
                    'postcss-loader',/*添加前缀*/
                    'sass-loader'  /*现状换成css文件*/
                ]
            },
            // postcss,postcss-loader
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template:'./src/index.vue',  //以这个为模板，注入打包后的js
            cache: false,
        }),
        new cleanWebpackPlugin(),
    ],
    devServer:{
        contentBase: './dist',
        proxy: {
            'xxx': {
                target: '实际',
                changeOrigin: true,
                pathRedirect:{

                }
            }
        }
    }
}
