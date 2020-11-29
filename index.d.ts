/// <reference types="node" />
import { FastifyPluginAsync } from 'fastify';
import { HashOptions, HexBase64Latin1Encoding } from 'crypto';
export interface FastEtagOptions {
    weak: boolean;
    algorithm: string;
    hashOptions: HashOptions | undefined;
    encoding: HexBase64Latin1Encoding;
}
declare const _default: FastifyPluginAsync<FastEtagOptions, import("http").Server>;
export default _default;
