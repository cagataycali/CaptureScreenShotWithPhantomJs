var path = require('path');
var AWS = require('aws-sdk');
var exec = require('exec');
var fs = require('fs');
var util = require('util');
var streamingS3 = require('streaming-s3');

exports.takeScreenshot = function(event) {

  var url = event.url;
  var bucket = event.bucket;
  var fileS3Key = event.fileS3Key;
  var width = event.width;
  var height = event.height;

  /*
    Phantomjs process trigger command
  */
  var cmd = `./phantomjs capture.js ${url} ${width} ${height} ${fileS3Key}`;
  exec(cmd, function(err, out, code) {
    if (err instanceof Error)
      throw err;
    process.stdout.write(out);
    console.log(out);

    /*
      Img data.
    */
    var data = fs.createReadStream('/tmp/' + fileS3Key);

    /*
      S3 uploader process
    */
    var uploader = new streamingS3(data,
      {
      accessKeyId: event.accessKeyId,
      secretAccessKey: event.secretAccessKey,
      },
      {
        Bucket: event.bucket,
        Key: event.fileS3Key,
      }
    );

    uploader.begin();

    uploader.on('data', (bytesRead) => {
      console.log(bytesRead, ' bytes read.');
    });

    uploader.on('part', (number) => {
      console.log('Part ', number, ' uploaded.');
    });

    uploader.on('uploaded', (stats) => {
      console.log('Upload stats: ', stats);
    });

    uploader.on('finished', (resp) => {
      console.log('Upload finished: ', resp);
      console.log(resp.Location);
      fs.unlink('/tmp/' + fileS3Key, function() { // Delete item.
        console.log(`${fileS3Key} deleted successfully.`);
      });
    });

    uploader.on('error', (e) => {
      console.log('Upload error: ', e);
      fs.unlink('/tmp/' + fileS3Key, function() { // Delete item.
        console.log(`${fileS3Key} deleted successfully.`);
      });
    });

  });
}
