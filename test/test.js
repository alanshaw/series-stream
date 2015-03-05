var fs = require('fs')
var test = require('tape')
var concat = require('concat-stream')
var funnel = require('../')

var path1 = __dirname + '/fixtures/1'
var path2 = __dirname + '/fixtures/2'
var path3 = __dirname + '/fixtures/3'

var content1 = fs.readFileSync(path1)
var content2 = fs.readFileSync(path2)
var content3 = fs.readFileSync(path3)

test('Maintains ordering', function (t) {
  t.plan(1)

  var f = funnel()

  fs.createReadStream(path2).pipe(f)
  fs.createReadStream(path1).pipe(f)
  fs.createReadStream(path3).pipe(f)

  f.pipe(concat({encoding: 'string'}, function (data) {
    t.equal(data, content2 + content1 + content3, 'Order maintained!')
    t.end()
  }))
})
