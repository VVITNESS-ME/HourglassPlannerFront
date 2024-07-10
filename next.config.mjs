const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        return [{
            source: '/api/:path*',
            destination: 'https://hourglass.ninja:10000/:path*'
        }]
    }
};

export default nextConfig;