import {logger} from '@protium/core'
import error from '@protium/core/lib/error-renderer'
import {NextFunction, Request, Response} from 'express'
const Convert = require('ansi-to-html') // tslint:disable-line

const convert = new Convert({
  bg: '#000',
  colors: {
    0: '#000',
    1: '#A00',
    2: '#0A0',
    3: '#A50',
    4: '#00A',
    5: '#A0A',
    6: '#0AA',
    7: '#AAA',
    8: '#555',
    9: '#F55',
    10: '#5F5',
    11: '#FF5',
    12: '#55F',
    13: '#F5F',
    14: '#5FF',
    15: '#FFF',
  },
  fg: '#FFF',
  newline: true,
})

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
