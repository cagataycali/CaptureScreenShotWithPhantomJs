var system = require('system');
var args = system.args;

if (args.length === 1) {
  console.log('Please try like this: \n ./phantomjs capture.js http://github.com 1280 720 output.png');
  phantom.exit(0);
} else {
  var url = args[1] ? args[1]:'http://github.com';
  var width = args[2] ? args[2]:1280;
  var height = args[3] ? args[3]:720;
  var name = args[4] ? args[4]:'output.png';

  var page = require('webpage').create();
  page.viewportSize = { width: width, height: height };

  page.open(url, function (status) {
    page.render('/tmp/' + name, { format: "png" });
    phantom.exit();
  });
}
