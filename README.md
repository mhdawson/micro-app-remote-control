# micro-app-remote-control - mqtt based remote control

This remote control provides a remote control GUI that
can be used to control devices that can be signaled through
mqtt.  This can be be used with X10 based devices, 433Mhz
devices as well as IR controlled devices through
the [micro-app-mqtt-x10-bridge]
(https://github.com/mhdawson/micro-app-mqtt-x10-bridge),
[arduino-sensors/ACRemote/]
(https://github.com/mhdawson/arduino-sensors/tree/master/ACRemote),
and [PI433WirelessTXManager]
(https://github.com/mhdawson/PI433WirelessTXManager)
projects as well as any other device which an be controlled
through mqtt.

The buttons on the remote control are fully customizable
in terms of location, size, color and what mqtt topic/message
is invoked when the button is pressed.

The remote can be realized as a browser window, native
desktop application or native mobile app using the
[micro-app-electron-launcher]
(https://github.com/mhdawson/micro-app-electron-launcher), or
[micro-app-cordova-launcher]
(https://github.com/mhdawson/micro-app-cordova-launcher) 
projects.

These are examples of my initial remote setup as a browser
window and native android application:

![remote control browser]
(https://raw.githubusercontent.com/mhdawson/micro-app-remote-control/master/pictures/browser-remote.jpg)

![remote control phone]
(https://raw.githubusercontent.com/mhdawson/micro-app-remote-control/master/pictures/phone-remote.jpg)

Right now I've configured it to allow me to turn on/off lights
in our living room and dining room, turn off all lights at once
and to turn one/off the split air conditioner in our bedroom.

# Usage

After installation modify ../lib/config.json to match your configuration

The configuration entries that must be updated include:

* title - title for the remote (optional)
* mqttServerUrl - url of the mqtt server to connect to.  This can either start
  with tcp:// or mqtts://. If it starts with mqtts://  there must be a subdirectory
  in the lib directory called mqttclient which contains ca.cert, client.cert,
  client.key which contain the key and associated certificates for a client
  which is authorized to connect to the mqtt server.
* serverPort - port on which the dashboard listens for connections
* size - object with x and y fields that define the size used for the remote window
* buttons - array in which each entry defines a button on the remote.  Each entryh
  is an object with the following values:
  * label - text to be shown on the button
  * size - object with x and y fields for the sizes of the button
  * position - object with x and y fields for the position of the button
  * color - color for the button
  * commands - array of objects which define the message(s) to be sent when the
  button is pressed.  Each object has the following values:
    * topic - topic on which message wil be sent when button is pressed
    * message -  message sent on topic when button is pressed
    * delay - delay after the button is pressed when the message is sent 
    often when a button invokes multiple actions you will need to have a delay

As a micro-app the dashboard also supports other options like authentication and
tls for the dashboard connection.  See the documentation for the [micro-app-framework]
(https://github.com/mhdawson/micro-app-framework) for additional details.

The following is an example of the configuration file:

<PRE>
{
  "title": "Remote Control",
  "size": {"x": 252, "y": 264},
  "serverPort": 3000,
  "mqttServerUrl": "tcp://10.1.1.186:1883",
  "buttons": [ { "label": "LR ON", "size": {"x": 60, "y": 60}, "position": {"x":  126, "y": 2}, "color": "green", "commands": [ {"topic": "house/x10" , "message": "A,1,1" }] },
               { "label": "LR OFF", "size": {"x": 60, "y": 60}, "position": {"x":  188, "y": 2}, "color": "green", "commands": [ {"topic": "house/x10" , "message": "A,1,0" }] },
               { "label": "LL ON", "size": {"x": 60, "y": 60}, "position": {"x":  2, "y": 2}, "color": "green", "commands": [ {"topic": "house/x10" , "message": "A,2,1" }] },
               { "label": "LL OFF", "size": {"x": 60, "y": 60}, "position": {"x":  64, "y": 2}, "color": "green", "commands": [ {"topic": "house/x10" , "message": "A,2,0" }] },
               { "label": "D ON", "size": {"x": 60, "y": 60}, "position": {"x": 2, "y": 64}, "color": "green", "commands": [ {"topic": "house/x10" , "message": "A,5,1" }] },
               { "label": "D OFF", "size": {"x": 60, "y": 60}, "position": {"x": 64, "y": 64}, "color": "green", "commands": [ {"topic": "house/x10" , "message": "A,5,0" }] },
               { "label": "ALL OFF", "size": {"x": 246, "y": 60}, "position": {"x": 2, "y": 126}, "color": "red",  "commands": [ { "delay": 0, "topic": "house/x10" , "message": "A,5,0" },
                                                                                                                                 { "delay": 1000, "topic": "house/x10" , "message": "A,1,0" },
                                                                                                                                 { "delay": 2000, "topic": "house/x10" , "message": "A,2,0" }] },
               { "label": "AC ON", "size": {"x": 122, "y": 60}, "position": {"x": 2, "y": 202}, "color": "green", "commands": [ {"topic": "home/2272" , "message": "0F0FFFFF0110" }] },
               { "label": "AC OFF", "size": {"x": 122, "y": 60}, "position": {"x": 126, "y": 202}, "color": "green", "commands": [ {"topic": "home/2272" , "message": "0F0FFFFF0101" }] }
             ]
}
</PRE>

# Installation

Simply run:

<PRE>
npm install micro-app-remote-control
</PRE>

and then configure as described in the section above.

# Running

To run the micro-app-remote-control app, add node.js to your path (currently requires 4.x or better) and
then run:

<PRE>
npm start
</PRE>

from the directory in the micro-app-remote-control was installed.

Once the server is started. Point your browser at the host/port for the server.
If you have configured your browser to allow javascript to close the current page
the original window will be closed and one with the correct size of the
alert-dashboard app page will be created.


# Example

The following is the page shown for a sample configuration:

![remote control browser]
(https://raw.githubusercontent.com/mhdawson/micro-app-remote-control/master/pictures/browser-remote.jpg)

# Key Depdencies

## micro-app-framework
As a micro-app the onetime password app depends on the micro-app-framework:

* [micro-app-framework npm](https://www.npmjs.com/package/micro-app-framework)
* [micro-app-framework github](https://github.com/mhdawson/micro-app-framework)

See the documentation on the micro-app-framework for more information on general
configurtion options that are availble (ex using tls, authentication, serverPort, etc)
