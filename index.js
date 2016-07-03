var press = require('./press');

var event = {
  accessKeyId: 's3AccessKeyId',
  secretAccessKey: 's3SecretAccessKey',
  url: 'https://github.com',
  bucket: 's3Bucket',
  fileS3Key: new Date().getTime() + '.png',
  width: '1280',
  height: '720',
}

press.takeScreenshot(event);
