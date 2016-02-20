'use strict'

module.exports = {
  method: 'post',
  action: function(req, res) {
    req.session.email = undefined;
    res.send();
  }
};
