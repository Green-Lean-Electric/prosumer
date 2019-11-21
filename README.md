# Prosumer

Basic functionality

In this assignment you will build a web app for the Prosumer in which he/she can view and control the different aspects of his/her electricity production and consumption. The application must be secured with a login in order to prevent non-authorized persons from controlling the Prosumer’s system. In the most basic form, a Prosumer should be able to:

Sign up, login, and logout (make sure to apply proper security principles)
See the following (as text): 
the current wind
current production
current consumption
net production (i.e. the current production minus the current consumption)
how much is in the buffer
current electricity price on the market
In case of excessive production, Prosumer should be able to control the ratio of how much should be sold to the market and how much should be sent to the buffer
In case of under-production, control the ratio of how much should be bought from the market and how much should be taken from the buffer
The Prosumer can read values from the simulator, and values should be sampled at a rate of 0.1 Hz or higher
Should be able to upload a picture of the Prosumer’s house (that is then visible in the application)
 

Advanced functionality

Here are some suggestions in order to obtain a higher grade:

The monitoring panel can be made more user-friendly by for example including gauges for displaying:
Consumption
Wind speed
Sliders or other suitable controls for determining the ratio from/to the market and buffer
A chat where messages from system administrators or friends can be displayed
The monitoring system should be responsive (e.g. have a mobile view)
The monitoring system should handle multiple logins (e.g. one from mobile, one from desktop)
There should be a profile page where the Prosumer can update credentials and delete his/her account
Messages in the chat has a priority and filters for low, medium, high. High priority messages issues a special notification to the user (e.g. a sound, pop-up etc). 
The messages in the chat must not suffer from XSS vulnerabilities etc.
The Prosumer can re-order the visual gauges for example using drag-n-drop
The data stream from the simulator is made “real time” i.e. streaming from the simulator
The Prosumer can add “Warning level thresholds” that issues notifications when for example the Battery buffer drops below a certain value
Have a “friends” list of other Prosumer’s which they are allowed to interact with (e.g. see their information etc)
Push-to-talk button for contacting the Manager or friends over voice
Analyze QoS for response times etc. Issue warnings if the server responds slowly or even implement dead reckoning or similar to cope with server downtimes
The Prosumer’s application should be hosted by a web server (e.g. NodeJS) that is configured to run on the provided virtual machine. It must respond to incoming web requests on a specific IP and port. At least three views should be created: one page for registration, one for login, and one for the monitoring panel.
