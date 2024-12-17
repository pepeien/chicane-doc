const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '**',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '**',
                pathname: '**',
            },
        ],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
};

module.exports = nextConfig;
