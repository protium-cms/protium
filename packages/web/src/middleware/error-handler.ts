import {logger} from '@protium/core'
import error from '@protium/core/lib/error-renderer'
import {NextFunction, Request, Response} from 'express'
const Convert = require('ansi-to-html') // tslint:disable-line

import Fs from 'fs'
import Path from 'path'
const nesCss = Fs.readFileSync(require.resolve('nes.css/css/nes.min.css'))
  .toString('utf8')

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
  const status = error.status || 500
  const color = status >= 500
    ? 'is-error'
    : 'is-warning'

  res.status(status).send(`
    <!doctype html>
    <style>
      ${nesCss}
      body { padding: 2em }
      .code {
        font-family: monospace;
        font-size: 14px;
        padding: 1.4em 3em 1.4em 1.4em;
        border-radius: 4px;
      }
      pre span {
        display: inline-block;
      }
      hr {
        border: none;
        border-bottom: 4px solid #000;
        margin-bottom: 1.2em;
      }
      .nes-container {
        padding-bottom: 3em;
      }
    </style>
    <section class="nes-container with-title">
      <header style="overflow: auto">
        <span style="float:right" class="nes-btn ${color}">${status}</span>
        <h1>protium: <small>There was an error...</small></h1>
        <p>${err.message}</p>
      </header>
      <div class="nes-container is-dark with-title">
        <p class="title">Stack Info</p>
        <div class="code">
        ${errorHtml}
        </div>
      </div>
    </section>
  `)
  logger.error(err)
}
