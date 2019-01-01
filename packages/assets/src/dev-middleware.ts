import {NextFunction, Request, Response} from 'express'

export default function devMiddleware (req: Request, res: Response, next: NextFunction) {
  next()
}
