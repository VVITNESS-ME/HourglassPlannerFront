/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [{
            source: '/api/:path*',
            destination: 'http://hourglass.ninja:8082/:path*'
        }];
    }
};

export default nextConfig;