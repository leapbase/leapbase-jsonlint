'use strict';
var debug = require('debug')('jsonlint');
var util = require('util');
var tool = require('leaptool');
var jsonlint = require("jsonlint");

module.exports = function(app) {

  var module_name = 'jsonlint';
  app.eventEmitter.emit('extension::init', module_name);
  
  var block = {
    app: app,
    role: 'user',
    description: 'JSON Lint Tool',
    tags: ['tool']
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));
  
  block.model = {
    name: { 
      type: 'string',
      required: true,
      option: {
        unique: true
      } 
    },
    input: {
      type: 'text'
    },
    output: {
      type: 'text'
    },
    type: {
      type: 'string'
    },
    create_by: { type: 'string', config:{ auto:true } },
    create_date: { type: 'date', config:{ auto:true } },
    edit_by: { type: 'string', config:{ auto:true } },
    edit_date: { type: 'date', config:{ auto:true } }
  };

  block.option = {
    edit_fields: ['name', 'type'],
    list_fields: ['name', 'type'],
    search_fields: ['name', 'type']
  };
  
  block.convert = function(input) {
    var result = '';
    var error = null;
    try {
      result = jsonlint.parse(input);
    } catch(e) {
      error = e.toString();
    }
    return { error:error, result:result };
  };

  // page
  block.page.index = function(req, res, record) {
    var condition = { type:'example' };
    app.db.find(module_name, condition, {}, function(error, docs, info) {
      console.log('jsonlint find result:', error, docs, info);
      var page = app.getPage(req, { title:'jsonlint' });
      page.record = record;
      page.examples = docs;
      res.render('jsonlint/index', { page:page });
    });
  };
  
  block.page.convert = function(req, res) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('jsonlint convert parameter:', parameter);
    var data = block.convert(parameter.input);
    app.sendJsonData(req, res, data);
  };
  
  block.page.viewByName = function(req, res) {
    var parameter = tool.getReqParameter(req);
    var condition = { name:parameter.name };
    app.db.find(module_name, condition, {}, function(error, docs, info) {
      console.log('jsonlint find by name result:', error, docs, info);
      var record = docs && docs[0] || null;
      if (record) {
        block.page.index(req, res, record);
      } else {
        var result = 'record is not found'; 
        app.renderInfoPage(null, [], { message:result }, req, res);
      }
    });
  };
  
  // page route
  app.server.get('/jsonlint', block.page.index);
  app.server.post('/jsonlint/convert', block.page.convert);
  app.server.get('/jsonlint/:name', block.page.viewByName);

  return block;
};
