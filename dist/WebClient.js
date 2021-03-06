"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const objectEntries = require("object.entries"); // tslint:disable-line:no-require-imports
const urlJoin = require("url-join"); // tslint:disable-line:no-require-imports
const isStream = require("is-stream"); // tslint:disable-line:no-require-imports
const EventEmitter = require("eventemitter3"); // tslint:disable-line:import-name no-require-imports
const PQueue = require("p-queue"); // tslint:disable-line:import-name no-require-imports
const pRetry = require("p-retry"); // tslint:disable-line:no-require-imports
const delay = require("delay"); // tslint:disable-line:no-require-imports
// NOTE: to reduce depedency size, consider https://www.npmjs.com/package/got-lite
const got = require("got"); // tslint:disable-line:no-require-imports
const FormData = require("form-data"); // tslint:disable-line:no-require-imports import-name
const util_1 = require("./util");
const errors_1 = require("./errors");
const logger_1 = require("./logger");
const retry_policies_1 = require("./retry-policies");
const pkg = require('../package.json'); // tslint:disable-line:no-require-imports no-var-requires
/**
 * A client for Slack's Web API
 *
 * This client provides an alias for each {@link https://api.slack.com/methods|Web API method}. Each method is
 * a convenience wrapper for calling the {@link WebClient#apiCall} method using the method name as the first parameter.
 */
class WebClient extends EventEmitter {
    /**
     * @param token - An API token to authenticate/authorize with Slack (usually start with `xoxp`, `xoxb`, or `xoxa`)
     */
    constructor(token, { slackApiUrl = 'https://slack.com/api/', logger = undefined, logLevel = logger_1.LogLevel.INFO, maxRequestConcurrency = 3, retryConfig = retry_policies_1.default.retryForeverExponentialCappedRandom, agent = undefined, tls = undefined, } = {}) {
        super();
        /**
         * api method family
         */
        this.api = {
            test: (this.apiCall.bind(this, 'api.test')),
        };
        /**
         * apps method family
         */
        this.apps = {
            permissions: {
                info: (this.apiCall.bind(this, 'apps.permissions.info')),
                request: (this.apiCall.bind(this, 'apps.permissions.request')),
            },
        };
        /**
         * auth method family
         */
        this.auth = {
            revoke: (this.apiCall.bind(this, 'auth.revoke')),
            test: (this.apiCall.bind(this, 'auth.test')),
        };
        /**
         * bots method family
         */
        this.bots = {
            info: (this.apiCall.bind(this, 'bots.info')),
        };
        /**
         * channels method family
         */
        this.channels = {
            archive: (this.apiCall.bind(this, 'channels.archive')),
            create: (this.apiCall.bind(this, 'channels.create')),
            history: (this.apiCall.bind(this, 'channels.history')),
            info: (this.apiCall.bind(this, 'channels.info')),
            invite: (this.apiCall.bind(this, 'channels.invite')),
            join: (this.apiCall.bind(this, 'channels.join')),
            kick: (this.apiCall.bind(this, 'channels.kick')),
            leave: (this.apiCall.bind(this, 'channels.leave')),
            list: (this.apiCall.bind(this, 'channels.list')),
            mark: (this.apiCall.bind(this, 'channels.mark')),
            rename: (this.apiCall.bind(this, 'channels.rename')),
            replies: (this.apiCall.bind(this, 'channels.replies')),
            setPurpose: (this.apiCall.bind(this, 'channels.setPurpose')),
            setTopic: (this.apiCall.bind(this, 'channels.setTopic')),
            unarchive: (this.apiCall.bind(this, 'channels.unarchive')),
        };
        /**
         * chat method family
         */
        this.chat = {
            delete: (this.apiCall.bind(this, 'chat.delete')),
            getPermalink: (this.apiCall.bind(this, 'chat.getPermalink')),
            meMessage: (this.apiCall.bind(this, 'chat.meMessage')),
            postEphemeral: (this.apiCall.bind(this, 'chat.postEphemeral')),
            postMessage: (this.apiCall.bind(this, 'chat.postMessage')),
            unfurl: (this.apiCall.bind(this, 'chat.unfurl')),
            update: (this.apiCall.bind(this, 'chat.update')),
        };
        /**
         * conversations method family
         */
        this.conversations = {
            archive: (this.apiCall.bind(this, 'conversations.archive')),
            close: (this.apiCall.bind(this, 'conversations.close')),
            create: (this.apiCall.bind(this, 'conversations.create')),
            history: (this.apiCall.bind(this, 'conversations.history')),
            info: (this.apiCall.bind(this, 'conversations.info')),
            invite: (this.apiCall.bind(this, 'conversations.invite')),
            join: (this.apiCall.bind(this, 'conversations.join')),
            kick: (this.apiCall.bind(this, 'conversations.kick')),
            leave: (this.apiCall.bind(this, 'conversations.leave')),
            list: (this.apiCall.bind(this, 'conversations.list')),
            members: (this.apiCall.bind(this, 'conversations.members')),
            open: (this.apiCall.bind(this, 'conversations.open')),
            rename: (this.apiCall.bind(this, 'conversations.rename')),
            replies: (this.apiCall.bind(this, 'conversations.replies')),
            setPurpose: (this.apiCall.bind(this, 'conversations.setPurpose')),
            setTopic: (this.apiCall.bind(this, 'conversations.setTopic')),
            unarchive: (this.apiCall.bind(this, 'conversations.unarchive')),
        };
        /**
         * dialog method family
         */
        this.dialog = {
            open: (this.apiCall.bind(this, 'dialog.open')),
        };
        /**
         * dnd method family
         */
        this.dnd = {
            endDnd: (this.apiCall.bind(this, 'dnd.endDnd')),
            endSnooze: (this.apiCall.bind(this, 'dnd.endSnooze')),
            info: (this.apiCall.bind(this, 'dnd.info')),
            setSnooze: (this.apiCall.bind(this, 'dnd.setSnooze')),
            teamInfo: (this.apiCall.bind(this, 'dnd.teamInfo')),
        };
        /**
         * emoji method family
         */
        this.emoji = {
            list: (this.apiCall.bind(this, 'emoji.list')),
        };
        /**
         * files method family
         */
        this.files = {
            delete: (this.apiCall.bind(this, 'files.delete')),
            info: (this.apiCall.bind(this, 'files.info')),
            list: (this.apiCall.bind(this, 'files.list')),
            revokePublicURL: (this.apiCall.bind(this, 'files.revokePublicURL')),
            sharedPublicURL: (this.apiCall.bind(this, 'files.sharedPublicURL')),
            upload: (this.apiCall.bind(this, 'files.upload')),
            comments: {
                add: (this.apiCall.bind(this, 'files.comments.add')),
                delete: (this.apiCall.bind(this, 'files.comments.delete')),
                edit: (this.apiCall.bind(this, 'files.comments.edit')),
            },
        };
        /**
         * groups method family
         */
        this.groups = {
            archive: (this.apiCall.bind(this, 'groups.archive')),
            create: (this.apiCall.bind(this, 'groups.create')),
            createChild: (this.apiCall.bind(this, 'groups.createChild')),
            history: (this.apiCall.bind(this, 'groups.history')),
            info: (this.apiCall.bind(this, 'groups.info')),
            invite: (this.apiCall.bind(this, 'groups.invite')),
            kick: (this.apiCall.bind(this, 'groups.kick')),
            leave: (this.apiCall.bind(this, 'groups.leave')),
            list: (this.apiCall.bind(this, 'groups.list')),
            mark: (this.apiCall.bind(this, 'groups.mark')),
            open: (this.apiCall.bind(this, 'groups.open')),
            rename: (this.apiCall.bind(this, 'groups.rename')),
            replies: (this.apiCall.bind(this, 'groups.replies')),
            setPurpose: (this.apiCall.bind(this, 'groups.setPurpose')),
            setTopic: (this.apiCall.bind(this, 'groups.setTopic')),
            unarchive: (this.apiCall.bind(this, 'groups.unarchive')),
        };
        /**
         * im method family
         */
        this.im = {
            close: (this.apiCall.bind(this, 'im.close')),
            history: (this.apiCall.bind(this, 'im.history')),
            list: (this.apiCall.bind(this, 'im.list')),
            mark: (this.apiCall.bind(this, 'im.mark')),
            open: (this.apiCall.bind(this, 'im.open')),
            replies: (this.apiCall.bind(this, 'im.replies')),
        };
        /**
         * migration method family
         */
        this.migration = {
            exchange: (this.apiCall.bind(this, 'migration.exchange')),
        };
        /**
         * mpim method family
         */
        this.mpim = {
            close: (this.apiCall.bind(this, 'mpim.close')),
            history: (this.apiCall.bind(this, 'mpim.history')),
            list: (this.apiCall.bind(this, 'mpim.list')),
            mark: (this.apiCall.bind(this, 'mpim.mark')),
            open: (this.apiCall.bind(this, 'mpim.open')),
            replies: (this.apiCall.bind(this, 'mpim.replies')),
        };
        /**
         * oauth method family
         */
        this.oauth = {
            access: (this.apiCall.bind(this, 'oauth.access')),
            token: (this.apiCall.bind(this, 'oauth.token')),
        };
        /**
         * pins method family
         */
        this.pins = {
            add: (this.apiCall.bind(this, 'pins.add')),
            list: (this.apiCall.bind(this, 'pins.list')),
            remove: (this.apiCall.bind(this, 'pins.remove')),
        };
        /**
         * reactions method family
         */
        this.reactions = {
            add: (this.apiCall.bind(this, 'reactions.add')),
            get: (this.apiCall.bind(this, 'reactions.get')),
            list: (this.apiCall.bind(this, 'reactions.list')),
            remove: (this.apiCall.bind(this, 'reactions.remove')),
        };
        /**
         * reminders method family
         */
        this.reminders = {
            add: (this.apiCall.bind(this, 'reminders.add')),
            complete: (this.apiCall.bind(this, 'reminders.complete')),
            delete: (this.apiCall.bind(this, 'reminders.delete')),
            info: (this.apiCall.bind(this, 'reminders.info')),
            list: (this.apiCall.bind(this, 'reminders.list')),
        };
        /**
         * rtm method family
         */
        this.rtm = {
            connect: (this.apiCall.bind(this, 'rtm.connect')),
            start: (this.apiCall.bind(this, 'rtm.start')),
        };
        /**
         * search method family
         */
        this.search = {
            all: (this.apiCall.bind(this, 'search.all')),
            files: (this.apiCall.bind(this, 'search.files')),
            messages: (this.apiCall.bind(this, 'search.messages')),
        };
        /**
         * stars method family
         */
        this.stars = {
            add: (this.apiCall.bind(this, 'stars.add')),
            list: (this.apiCall.bind(this, 'stars.list')),
            remove: (this.apiCall.bind(this, 'stars.remove')),
        };
        /**
         * team method family
         */
        this.team = {
            accessLogs: (this.apiCall.bind(this, 'team.accessLogs')),
            billableInfo: (this.apiCall.bind(this, 'team.billableInfo')),
            info: (this.apiCall.bind(this, 'team.info')),
            integrationLogs: (this.apiCall.bind(this, 'team.integrationLogs')),
            profile: {
                get: (this.apiCall.bind(this, 'team.profile.get')),
            },
        };
        /**
         * usergroups method family
         */
        this.usergroups = {
            create: (this.apiCall.bind(this, 'usergroups.create')),
            disable: (this.apiCall.bind(this, 'usergroups.disable')),
            enable: (this.apiCall.bind(this, 'usergroups.enable')),
            list: (this.apiCall.bind(this, 'usergroups.list')),
            update: (this.apiCall.bind(this, 'usergroups.update')),
            users: {
                list: (this.apiCall.bind(this, 'usergroups.users.list')),
                update: (this.apiCall.bind(this, 'usergroups.users.update')),
            },
        };
        /**
         * users method family
         */
        this.users = {
            conversations: (this.apiCall.bind(this, 'users.conversations')),
            deletePhoto: (this.apiCall.bind(this, 'users.deletePhoto')),
            getPresence: (this.apiCall.bind(this, 'users.getPresence')),
            identity: (this.apiCall.bind(this, 'users.identity')),
            info: (this.apiCall.bind(this, 'users.info')),
            list: (this.apiCall.bind(this, 'users.list')),
            lookupByEmail: (this.apiCall.bind(this, 'users.lookupByEmail')),
            setActive: (this.apiCall.bind(this, 'users.setActive')),
            setPhoto: (this.apiCall.bind(this, 'users.setPhoto')),
            setPresence: (this.apiCall.bind(this, 'users.setPresence')),
            profile: {
                get: (this.apiCall.bind(this, 'users.profile.get')),
                set: (this.apiCall.bind(this, 'users.profile.set')),
            },
        };
        this.token = token;
        this.slackApiUrl = slackApiUrl;
        this.retryConfig = retryConfig;
        this.requestQueue = new PQueue({ concurrency: maxRequestConcurrency });
        this.agentConfig = agent;
        // NOTE: may want to filter the keys to only those acceptable for TLS options
        this.tlsConfig = tls !== undefined ? tls : {};
        // Logging
        if (logger !== undefined) {
            this.logger = logger_1.loggerFromLoggingFunc(WebClient.loggerName, logger);
        }
        else {
            this.logger = logger_1.getLogger(WebClient.loggerName);
        }
        this.logger.setLevel(logLevel);
        this.userAgent = util_1.getUserAgent();
        this.logger.debug('initialized');
    }
    apiCall(method, options, callback) {
        this.logger.debug('apiCall() start');
        // The following thunk is the actual implementation for this method. It is wrapped so that it can be adapted for
        // different executions below.
        const implementation = () => __awaiter(this, void 0, void 0, function* () {
            if (typeof options === 'string' || typeof options === 'number' || typeof options === 'boolean') {
                throw new TypeError(`Expected an options argument but instead received a ${typeof options}`);
            }
            const requestBody = this.serializeApiCallOptions(Object.assign({ token: this.token }, options));
            // The following thunk encapsulates the task so that it can be coordinated for retries
            const task = () => {
                this.logger.debug('request attempt');
                return got.post(urlJoin(this.slackApiUrl, method), 
                // @ts-ignore using older definitions for package `got`, can remove when type `@types/got` is updated for v8
                Object.assign({
                    form: !canBodyBeFormMultipart(requestBody),
                    body: requestBody,
                    retries: 0,
                    headers: {
                        'user-agent': this.userAgent,
                    },
                    agent: this.agentConfig,
                }, this.tlsConfig))
                    .catch((error) => {
                    // Wrap errors in this packages own error types (abstract the implementation details' types)
                    if (error.name === 'RequestError') {
                        throw requestErrorWithOriginal(error);
                    }
                    else if (error.name === 'ReadError') {
                        throw readErrorWithOriginal(error);
                    }
                    else if (error.name === 'HTTPError') {
                        throw httpErrorWithOriginal(error);
                    }
                    else {
                        throw error;
                    }
                })
                    .then((response) => {
                    const result = this.buildResult(response);
                    // log warnings in response metadata
                    if (result.response_metadata !== undefined && result.response_metadata.warnings !== undefined) {
                        result.response_metadata.warnings.forEach(this.logger.warn);
                    }
                    // handle rate-limiting
                    if (response.statusCode !== undefined && response.statusCode === 429) {
                        const retryAfterMs = result.retryAfter !== undefined ? result.retryAfter : (60 * 1000);
                        // NOTE: the following event could have more information regarding the api call that is being delayed
                        this.emit('rate_limited', retryAfterMs / 1000);
                        this.logger.info(`API Call failed due to rate limiting. Will retry in ${retryAfterMs / 1000} seconds.`);
                        // wait and return the result from calling `task` again after the specified number of seconds
                        return delay(retryAfterMs).then(task);
                    }
                    // For any error in the API response, treat them as irrecoverable by throwing an AbortError to end retries.
                    if (!result.ok) {
                        const error = errors_1.errorWithCode(new Error(`An API error occurred: ${result.error}`), errors_1.ErrorCode.PlatformError);
                        error.data = result;
                        throw new pRetry.AbortError(error);
                    }
                    return result;
                });
            };
            // The following thunk encapsulates the retried task so that it can be coordinated for request queuing
            const taskAfterRetries = () => pRetry(task, this.retryConfig);
            // The final return value is the resolution of the task after being retried and queued
            return this.requestQueue.add(taskAfterRetries);
        });
        // Adapt the interface for callback-based execution or Promise-based execution
        if (callback !== undefined) {
            util_1.callbackify(implementation)(callback);
            return;
        }
        return implementation();
    }
    /**
     * Transforms options into an object suitable for got to use as a body. This can be one of two things:
     * -  A FormCanBeURLEncoded object, which is just a key-value object where the values have been flattened and
     *    got can serialize it into application/x-www-form-urlencoded content type.
     * -  A BodyCanBeFormMultipart: when the options includes a file, and got must use multipart/form-data content type.
     *
     * @param options arguments for the Web API method
     */
    serializeApiCallOptions(options) {
        // The following operation both flattens complex objects into a JSON-encoded strings and searches the values for
        // binary content
        let containsBinaryData = false;
        const flattened = objectEntries(options)
            .map(([key, value]) => {
            if (value === undefined || value === null) {
                return [];
            }
            let serializedValue = value;
            if (Buffer.isBuffer(value) || isStream(value)) {
                containsBinaryData = true;
            }
            else if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
                // if value is anything other than string, number, boolean, binary data, a Stream, or a Buffer, then encode it
                // as a JSON string.
                serializedValue = JSON.stringify(value);
            }
            return [key, serializedValue];
        });
        // A body with binary content should be serialized as multipart/form-data
        if (containsBinaryData) {
            this.logger.debug('request arguments contain binary data');
            return flattened.reduce((form, [key, value]) => {
                if (Buffer.isBuffer(value) || isStream(value)) {
                    const options = {};
                    options.filename = (() => {
                        // attempt to find filename from `value`. adapted from:
                        // tslint:disable-next-line:max-line-length
                        // https://github.com/form-data/form-data/blob/028c21e0f93c5fefa46a7bbf1ba753e4f627ab7a/lib/form_data.js#L227-L230
                        // formidable and the browser add a name property
                        // fs- and request- streams have path property
                        const streamOrBuffer = value;
                        if (typeof streamOrBuffer.name === 'string') {
                            return path_1.basename(streamOrBuffer.name);
                        }
                        if (typeof streamOrBuffer.path === 'string') {
                            return path_1.basename(streamOrBuffer.path);
                        }
                        return defaultFilename;
                    })();
                    form.append(key, value, options);
                }
                else {
                    form.append(key, value);
                }
                return form;
            }, new FormData());
        }
        // Otherwise, a simple key-value object is returned
        return flattened.reduce((accumulator, [key, value]) => {
            if (key !== undefined && value !== undefined) {
                accumulator[key] = value;
            }
            return accumulator;
        }, {});
    }
    /**
     * Processes an HTTP response into a WebAPICallResult by performing JSON parsing on the body and merging relevent
     * HTTP headers into the object.
     * @param response
     */
    buildResult(response) {
        const data = JSON.parse(response.body);
        // add scopes metadata from headers
        if (response.headers['x-oauth'] !== undefined) {
            data.scopes = response.headers['x-oauth-scopes'].trim().split(/\s*,\s*/);
        }
        if (response.headers['x-accepted-oauth-scopes'] !== undefined) {
            data.acceptedScopes = response.headers['x-accepted-oauth-scopes'].trim().split(/\s*,\s*/);
        }
        // add retry metadata from headers
        if (response.headers['retry-after'] !== undefined) {
            data.retryAfter = parseInt(response.headers['retry-after'], 10) * 1000;
        }
        return data;
    }
}
/**
 * The name used to prefix all logging generated from this object
 */
WebClient.loggerName = `${pkg.name}:WebClient`;
exports.WebClient = WebClient;
exports.default = WebClient;
/*
 * Helpers
 */
const defaultFilename = 'Untitled';
/**
 * Determines whether a request body object should be treated as FormData-encodable (Content-Type=multipart/form-data).
 * @param body a request body
 */
function canBodyBeFormMultipart(body) {
    // tried using `isStream.readable(body)` but that failes because the object doesn't have a `_read()` method or a
    // `_readableState` property
    return isStream(body);
}
/**
 * A factory to create WebAPIRequestError objects
 * @param original
 */
function requestErrorWithOriginal(original) {
    const error = errors_1.errorWithCode(
    // any cast is used because the got definition file doesn't export the got.RequestError type
    new Error(`A request error occurred: ${original.code}`), errors_1.ErrorCode.RequestError);
    error.original = original;
    return error;
}
/**
 * A factory to create WebAPIReadError objects
 * @param original
 */
function readErrorWithOriginal(original) {
    const error = errors_1.errorWithCode(
    // any cast is used because the got definition file doesn't export the got.ReadError type
    new Error('A response read error occurred'), errors_1.ErrorCode.ReadError);
    error.original = original;
    return error;
}
/**
 * A factory to create WebAPIHTTPError objects
 * @param original
 */
function httpErrorWithOriginal(original) {
    const error = errors_1.errorWithCode(
    // any cast is used because the got definition file doesn't export the got.HTTPError type
    new Error(`An HTTP protocol error occurred: statusCode = ${original.statusCode}`), errors_1.ErrorCode.HTTPError);
    error.original = original;
    return error;
}
//# sourceMappingURL=WebClient.js.map