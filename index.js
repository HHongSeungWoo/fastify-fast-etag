"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const crypto_1 = require("crypto");
const DefaultOptions = {
    weak: true,
    algorithm: "sha1",
    hashOptions: undefined,
    encoding: "base64"
};
const FastEtagAsync = async (fastify, options) => {
    options = Object.assign(DefaultOptions, options);
    fastify.addHook('onSend', function (request, reply, payload, done) {
        let etag = reply.getHeader('etag');
        if (!etag) {
            if (!(typeof payload === 'string' || payload instanceof Buffer)) {
                done(null, payload);
                return;
            }
            etag = (options.weak ? 'W/"' : '"') + crypto_1.createHash(options.algorithm, options.hashOptions).update(payload).digest(options.encoding) + '"';
            reply.header('etag', etag);
        }
        if (request.headers['if-none-match'] === etag) {
            reply.code(304);
            done(null, '');
            return;
        }
        done(null, payload);
    });
};
exports.default = fastify_plugin_1.default(FastEtagAsync, '3.x');
