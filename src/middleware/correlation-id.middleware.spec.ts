import { CorrelationIdMiddleware } from './correlation-id.middleware';
import { Request, Response, NextFunction } from 'express';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'generated-uuid'),
}));

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    middleware = new CorrelationIdMiddleware();
    req = { headers: {} };
    res = { setHeader: jest.fn() };
    next = jest.fn();
  });

  it('should generate a correlation ID if none is provided', () => {
    middleware.use(req as Request, res as Response, next);

    expect(req.headers['x-correlation-id']).toBe('generated-uuid');
    expect(next).toHaveBeenCalled();
  });

  it('should use the provided correlation ID if it exists in the request headers', () => {
    req.headers['x-correlation-id'] = '123456';

    middleware.use(req as Request, res as Response, next);

    expect(req.headers['x-correlation-id']).toBe('123456');
    expect(next).toHaveBeenCalled();
  });
});
