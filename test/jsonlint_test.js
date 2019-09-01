var assert = require('assert');
var fs = require('fs');
var util = require('util');
var path = require('path');
var _ = require('lodash');

describe('leapbase', function() {
  describe('jsonlint module', function() {
    before(function() {
      var app = {};
      var appSitePath = path.resolve(process.cwd() + '/site')
      app.server = { get:function(){}, post:function(){}, all:function(){} };
      app.setting = require(path.join(appSitePath, '/setting')).setting;
      app.eventEmitter = { on:function(){}, emit:function(){} };
      jsonlintModule = require(path.join(appSitePath, '/app_modules/jsonlint'))(app);
    });
    it('convert well-formatted json input', function() {
      var input = '{ "name":"jack", "age":17, "isStuent":true }';
      var data = jsonlintModule.convert(input);
      assert.equal(
        data.error, 
        null
      );
      assert.equal(
        JSON.stringify(data.result), 
        '{"name":"jack","age":17,"isStuent":true}'
      );
    });
    it('convert ill-formatted json input', function() {
      var input = '{ "name":jack, "age":17 }';
      var data = jsonlintModule.convert(input);
      assert.equal(
        data.error.length > 0, 
        true
      );
      assert.equal(
        data.result, 
        ''
      );
    });
  });
});
