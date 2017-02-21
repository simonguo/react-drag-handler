const path = require('path');
const webpack = require('webpack');
const marked = require('marked');
const hl = require('highlight.js');

const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const codeRenderer = function (code, lang) {
    lang = lang === 'js' ? 'javascript' : lang;
    if (lang === 'html') {
        lang = 'xml';
    }

    var hlCode = lang ? hl.highlight(lang, code).value : hl.highlightAuto(code).value;

    return `<div class="doc-highlight"><pre><code class="${lang || ''}">${hlCode}</code></pre></div>`;
};

const renderer = new marked.Renderer();

renderer.code = codeRenderer;

const config = {
    entry: [
        path.join(__dirname, 'docs/index')
    ],
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new ExtractTextPlugin('[name].css'),
        new HtmlwebpackPlugin({
            title: 'RSuite Tree',
            filename: 'index.html',
            template: 'docs/index.html',
            inject: true,
            hash: true
        }),
        new webpack.BannerPlugin(`Last update: ${new Date().toString()}`)
    ],
    module: {
        loaders: [

            {
                test: /\.js$/,
                loaders: [
                    'babel?babelrc'
                ],
                exclude: /node_modules/
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'url?limit=8192'
            }, {
                test: /\.md$/,
                loader: 'html!markdown'
            }
        ]
    },
    markdownLoader: {
        renderer: renderer
    }
};

module.exports = config;
