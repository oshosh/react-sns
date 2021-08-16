
// const withImages = require('next-images')
// module.exports = withImages()

const withImages = require('next-images')
module.exports = withImages({
    fileExtensions: ["jpg", "jpeg", "png", "svg", "gif"],
    webpack(config) {
        // config.module.rules.push({ // 웹팩설정에 로더 추가함
        //     test: /\.(svg)$/,
        //     issuer: {
        //         test: /\.(js|ts)x?$/,
        //     },
        //     use: ['@svgr/webpack', 'url-loader'],
        // });

        return config;
    },
})

// module.exports = {
//     webpack(config) {
//         config.module.rules.push({ // 웹팩설정에 로더 추가함
//             test: /\.(svg)$/,
//             issuer: {
//                 test: /\.(js|ts)x?$/,
//             },
//             use: ['@svgr/webpack', 'url-loader'],
//         });

//         return config;
//     },
// };