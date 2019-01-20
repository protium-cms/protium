import {logger} from '@protium/core'
import error from '@protium/core/lib/error-renderer'
import {NextFunction, Request, Response} from 'express'
const Convert = require('ansi-to-html') // tslint:disable-line
const convert = new Convert()

export default function errorHandler (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errorHtml = convert.toHtml(error.render(err))
  res.send(`
    <!doctype html>
    <style>
      body { background: #000; color: #fff; }

    </style>
    <pre>${errorHtml}</pre>
  `)
  logger.error(err)
}
