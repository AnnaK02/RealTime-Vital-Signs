import { Response } from 'express';

export default (res: Response, data: any, status?: number) => {
  return res.status(status || 200).json({
    status: status || 200,
    ...(status === 500 ? { error: data } : { data }),
  });
}