var ip = require('ip');
var ipStream = ip.address()
ipStream = "http://"+ipStream+ ":8091"
/**
 * GET /
 * UI page.
 */
exports.index = (req, res) => {
  res.render('ui', {
    title: 'ui',
    streamip : ipStream

  });
  console.log(ipStream);
};
