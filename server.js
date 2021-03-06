#!/bin/env node
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');

/**
 *  Define the sample application.
 */
var NotesApp = function() {
  //  Scope.
  var self = this;

  /*  ================================================================  */
  /*  Helper functions.                                                 */
  /*  ================================================================  */

  /**
   *  Set up server IP address and port # using env variables/defaults.
   */
  self.setupVariables = function() {
    //  Set the environment variables we need.
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof self.ipaddress === "undefined") {
      //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
      //  allows us to run/test the app locally.
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    };
  };

  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function(sig){
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating sample app ...',
            Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
  };

  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function(){
    //  Process on exit and signals.
    process.on('exit', function() { self.terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
     'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
      process.on(element, function() { self.terminator(element); });
    });
  };

  /**
   * Redirects all http traffic to https
   */
  self.redirectToHttps = function(req, res, next) {
    if (req.headers['x-forwarded-proto'] == 'http') {
      res.redirect('https://' + req.headers.host + req.path);
    } else {
      return next();
    }
  }

  /**
   *  Initialize the server (express) and create the routes and register
   *  the handlers.
   */
  self.initializeServer = function(callback) {
    self.routes = require('./src/routes/routes');
    self.app = express.createServer();
    self.app.use(self.redirectToHttps);
    self.app.use(express.static('public'));
    self.app.use(session({
      secret: 'EInecV62i3DyWhsVhlpq',
      resave: false,
      saveUninitialized: true
    }));
    self.app.use(bodyParser.json());
    self.routes.init(self.app).then(function() {
      callback();
    }, function () {
      throw new Error('Failed to load routes');
    });
  };

  /**
   *  Initializes the sample application.
   */
  self.initialize = function(callback) {
    self.setupVariables();
    self.setupTerminationHandlers();

    // Create the express server and routes.
    self.initializeServer(callback);
  };

  /**
   *  Start the server (starts up the sample application).
   */
  self.start = function() {
    //  Start the app on the specific interface (and port).
    self.app.listen(self.port, self.ipaddress, function() {
      console.log(
        '%s: Node server started on %s:%d ...',
        Date(Date.now()),
        self.ipaddress,
        self.port
      );
    });
  };
};   /*  Sample Application.  */

/**
 *  main():  Main code.
 */
var zapp = new NotesApp();
zapp.initialize(zapp.start);
