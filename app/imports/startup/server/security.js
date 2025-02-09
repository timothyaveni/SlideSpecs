import { Meteor } from "meteor/meteor";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";
import { BrowserPolicy } from "meteor/browser-policy-common";

// Don't let people write arbitrary data to their 'profile' field from the client
Meteor.users.deny({
    update() {
        return true;
    },
});

// Get a list of all accounts methods by running `Meteor.server.method_handlers` in meteor shell
const AUTH_METHODS = [
    "login",
    "logout",
    "logoutOtherClients",
    "getNewToken",
    "removeOtherTokens",
    "configureLoginService",
    "changePassword",
    "forgotPassword",
    "resetPassword",
    "verifyEmail",
    "createUser",
    "ATRemoveService",
    "ATCreateUserServer",
    "ATResendVerificationEmail",
];

// allowing blobs to run
BrowserPolicy.content.allowOriginForAll("blob:");

// Only allow 2 login attempts per connection per 5 seconds
DDPRateLimiter.addRule(
    {
        name(name) {
            return AUTH_METHODS.includes(name);
        },

        // Rate limit per connection ID
        connectionId() {
            return true;
        },
    },
    2,
    5000
);
