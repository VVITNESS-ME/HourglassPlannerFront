const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        return [{
            source: '/api/:path*',
            destination: 'http://hourglass.ninja:10000/:path*'
        }]
    }
};

export default nextConfig;