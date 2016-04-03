// Copyright 2016 the project authors as listed in the AUTHORS file.
// All rights reserved. Use of this source code is governed by the
// license that can be found in the LICENSE file.
"use strict";
var mqtt = require('mqtt');
var path = require('path');
var socketio = require('socket.io');
var util = require('util');

// this is filled in later as the socket io connection is established
var eventSocket;

var Server = function() {
}


Server.getDefaults = function() {
  return { 'title': 'Remote' };
}

var replacements;
Server.getTemplateReplacments = function() {
  if (replacements === undefined) {
    var config = Server.config;

    // create the html for the buttons
    var buttons = new Array();
    for (var i = 0; i < config.buttons.length; i++) {
      buttons[i] = '    <div id="button' + i + '" style="position: absolute; ' +
                   'width:' + config.buttons[i].size.x + 'px; ' +
                   'height:' + config.buttons[i].size.y + 'px; ' +
                   'top:' + config.buttons[i].position.y + 'px; ' +
                   'left:' + config.buttons[i].position.x + 'px; ' +
                   'text-align: center; ' +
                   'vertical-align: middle; ' +
                   'background-color:' + config.buttons[i].color + ';' +
                   '" ' +
                   'onclick="sendButton(' + i + ');" ' +
                   '>' + config.buttons[i].label +  '</div>';
    }

    replacements = [{ 'key': '<DASHBOARD_TITLE>', 'value': config.title },
                    { 'key': '<UNIQUE_WINDOW_ID>', 'value': config.title },
                    { 'key': '<PAGE_WIDTH>', 'value': config.size.x },
                    { 'key': '<PAGE_HEIGHT>', 'value': config.size.y },
                    { 'key': '<BUTTONS>', 'value': buttons.join("\n")}];

  }
  return replacements;
}


Server.startServer = function(server) {
  var config = Server.config;
  eventSocket = socketio.listen(server);

  // setup mqtt
  var mqttOptions;
  if (config.mqttServerUrl.indexOf('mqtts') > -1) {
    mqttOptions = { key: fs.readFileSync(path.join(__dirname, 'mqttclient', '/client.key')),
                    cert: fs.readFileSync(path.join(__dirname, 'mqttclient', '/client.cert')),
                    ca: fs.readFileSync(path.join(__dirname, 'mqttclient', '/ca.cert')),
                    checkServerIdentity: function() { return undefined }
    }
  }

  var mqttClient = mqtt.connect(config.mqttServerUrl, mqttOptions);

  mqttClient.on('connect',function() {
    // we don't listen for any mqtt data so don't need to setup subscrbe

    var sendCommand = function(command) {
      mqttClient.publish(command.topic, command.message);
    }

    eventSocket.on('connection', function(ioclient) {
      ioclient.on('button', function(buttonId) {
        var commands = config.buttons[buttonId].commands;
        for (var i = 0; i < commands.length; i++) {
          if (commands[i].delay !== undefined) {
            let command = commands[i];
            setTimeout(function() { sendCommand(command) }, commands[i].delay);
          } else {
            sendCommand(commands[i]);
          }
        }
      });
    });
  });

};


if (require.main === module) {
  var path = require('path');
  var microAppFramework = require('micro-app-framework');
  microAppFramework(path.join(__dirname), Server);
}


module.exports = Server;
