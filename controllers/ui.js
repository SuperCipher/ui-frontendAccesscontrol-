/**
 * GET /
 * UI page.
 */
exports.index = (req, res) => {
  res.render('ui', {
    title: 'ui'
  });
};
