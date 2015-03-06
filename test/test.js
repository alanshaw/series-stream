var fs = require('fs')
var test = require('tape')
var concat = require('concat-stream')
var Readable = require('stream').Readable
var SeriesStream = require('../').SeriesStream

var path1 = __dirname + '/fixtures/1'
var path2 = __dirname + '/fixtures/2'
var path3 = __dirname + '/fixtures/3'

var content1 = fs.readFileSync(path1)
var content2 = fs.readFileSync(path2)
var content3 = fs.readFileSync(path3)
var content4 = 'content4'

test('Maintains ordering', function (t) {
  t.plan(1)

  var ss = new SeriesStream()

  var rs1 = fs.createReadStream(path1)
  var rs2 = fs.createReadStream(path2)
  var rs3 = fs.createReadStream(path3)
  var rs4 = new Readable()

  rs4.id = 4

  rs4._read = function () {
    this.push(content4)
    this.push(null)
  }

  ss.add(rs2)
  ss.add(rs1)
  ss.add(rs4)
  ss.add(rs3)

  ss.pipe(concat({encoding: 'string'}, function (data) {
    t.equal(data, content2 + content1 + content4 + content3, 'Order maintained!')
    //t.ok(false)
    t.end()
  }))
})
