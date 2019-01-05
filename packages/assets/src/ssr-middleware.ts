import {NextFunction, Request, Response} from 'express'

export default function createSSRMiddleware () {
  return [
    resolverMiddleware,
    renderMiddleware,
  ]
}

function resolverMiddleware (req: Request, res: Response, next: NextFunction) {
  next()
}

function renderMiddleware (req: Request, res: Response, next: NextFunction) {
  next()
}
