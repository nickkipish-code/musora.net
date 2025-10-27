import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const r = await fetch(process.env.API_BASE_URL + '/orders');
  const data = await r.json();
  res.status(200).json(data);
}


