/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@bitcamp/myproject-common"],
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
