module.exports = {
    lintOnSave: false,
    publicPath: process.env.NODE_ENV === 'production' ? '/vuejs-build/' : '/',
    outputDir: '../../build/vuejs-build'
};
