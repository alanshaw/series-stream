var PassThrough = require('stream').PassThrough
var inherits = require('util').inherits

function Queue () {
  PassThrough.apply(this, arguments)
  this._current = null
  this._queue = []
  this.on('pipe', this._onPipe.bind(this))
}
inherits(Queue, PassThrough)

Queue.prototype._onPipe = function (src) {
  if (!this._current) {
    this._current = src
    return src.once('end', this._resumeNext.bind(this))
  }

  // No idea, we have to unpipe on the next tick for this to work
  process.nextTick(function () {
    src.unpipe(this)
    this._queue.push(src)
  }.bind(this))
}

Queue.prototype._resumeNext = function () {
  this._current = null
  if (!this._queue.length) return
  this._queue.shift().pipe(this)
}

Queue.prototype.end = function () {
  if (this._queue.length) return
  PassThrough.prototype.end.apply(this, arguments)
}

module.exports = function (opts) {
  return new Queue(opts)
}

module.exports.Queue = Queue
