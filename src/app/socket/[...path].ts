// import { createProxyMiddleware } from 'http-proxy-middleware';
// import type { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const proxy = createProxyMiddleware({
//   target: 'wss://hourglass.ninja:8889',
//   ws: true,
//   changeOrigin: true,
//   secure: false, // 로컬 인증서를 사용할 때, 필요에 따라 이 옵션을 설정
// });

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   proxy(req, res, (err) => {
//     if (err) {
//       res.status(500).send(err.message);
//     }
//   });
//   console.log("server proxy")
// }