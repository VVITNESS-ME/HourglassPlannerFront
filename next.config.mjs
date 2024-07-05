const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [{
            source: '/api/:path*',
            destination: 'http://localhost:8082/:path*'
        }];
    }
};

export default nextConfig;