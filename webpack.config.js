const webpack = require('webpack');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const path = require('path');

module.exports = ({ extract, locale, host }={}) => {
    const c3po = {};

    function localePath(path) {
        return locale ? `${locale}/${path}` : path ;
    }

    if (extract) {
        c3po.extract = { output: 'template.pot'}
    }

    if (locale) {
        c3po.resolve = { translations: `${locale}.po` };
    }

    return {
        entry: { app: './app.js' },
        output: { path: 'dist',  filename: localePath('app.js'), libraryTarget: 'umd' },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: { loader: 'babel-loader', options: { plugins: [['c-3po', c3po]] } }
                }
            ]
        },
        resolve: {
            alias: {
                'c-3po': path.join(__dirname, 'node_modules/c-3po/dist/mock.js')
            }
        },
        plugins: [
            new StaticSiteGeneratorPlugin('app', localePath('index.html')),
            new webpack.DefinePlugin({
                HOST: JSON.stringify(host || ''),
            }),
        ]

    }
};
