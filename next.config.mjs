/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: () => [
        {
            source: "/api/:path*",
            destination: "http://210.125.145.67:8001/api/:path*"
        }
    ]
};

export default nextConfig;
