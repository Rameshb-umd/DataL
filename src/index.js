/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.87e07fe8-7ad6-43e3-b676-9de6f1a0a399"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * Babe is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Babe = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Babe.prototype = Object.create(AlexaSkill.prototype);
Babe.prototype.constructor = Babe;

Babe.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Babe onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Babe.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Babe onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome, I am your virtual meeting assistant";
    var repromptText = "Ask me a question and i can anaylze the data and tell you";
    response.ask(speechOutput, repromptText);
};

Babe.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Babe onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Babe.prototype.intentHandlers = {
    // register custom intent handlers
    "BabeIntent": function (intent, session, response) {
        // Determine custom date
        response.tellWithCard("Hello Guys!", "Hello Guys!", "Hello Guys!");

    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Ask me a question and i can anaylze the data and tell you", "Ask me a question and i can anaylze the data and tell you!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Babe skill.
    var babe = new Babe();
    babe.execute(event, context);
};