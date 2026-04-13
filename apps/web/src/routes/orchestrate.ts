import express from 'express';
import type { Request, Response } from 'express';
import { orchestrate } from '../services/orchestrate';
import type { TransactionRequest } from '../types/orchestration';

const router = express.Router();

router.post('/orchestrate', (req: Request, res: Response) => {
  try {
    const body = req.body as TransactionRequest;

    if (
      !body.amount ||
      !body.currency ||
      !body.country ||
      !body.merchantCategory ||
      !body.type
    ) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    const result = orchestrate(body);

    console.log('Orchestration request:', body);
    console.log('Orchestration response:', result);

    return res.json(result);
  } catch (error) {
    console.error('Orchestration error:', error);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;
