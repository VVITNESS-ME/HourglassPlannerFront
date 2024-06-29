/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [{
            source: '/api/:path*',
            destination: 'http://192.168.1.80:8082/:path*'
        }];
    }
};

export default nextConfig;
