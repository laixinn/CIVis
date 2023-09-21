'use strict';

const euroHandler = require('../handler/euro_handler');
// const TestHandler = require('../handler/test_handler');
const { check } = require('express-validator/check');

module.exports = {
    routers: [
      {
          path: '/euro/getData',
          handler: euroHandler.getData,
          method: "get",
          params: [
          ]
      },
    ]
};
