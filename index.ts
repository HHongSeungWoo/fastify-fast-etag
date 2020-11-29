import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import {createHash, HashOptions, HexBase64Latin1Encoding} from 'crypto'

export interface FastEtagOptions {
    weak: boolean
    algorithm: string
    hashOptions: HashOptions | undefined
    encoding: HexBase64Latin1Encoding
}

const DefaultOptions: FastEtagOptions = {
    weak: true,
    algorithm: "sha1",
    hashOptions: undefined,
    encoding: "base64"
}

const FastEtagAsync: FastifyPluginAsync<FastEtagOptions> = async (fastify, options) => {

    options = Object.assign(DefaultOptions, options)

    fastify.addHook('onSend', function (request, reply, payload, done) {
        let etag = reply.getHeader('etag')

        if (!etag) {
            if (!(typeof payload === 'string' || payload instanceof Buffer)) {
                done(null, payload)
                return
            }

            etag = (options.weak ? 'W/"' : '"') + createHash(options.algorithm, options.hashOptions).update(payload).digest(options.encoding) + '"'
            reply.header('etag', etag)
        }

        if (request.headers['if-none-match'] === etag) {
            reply.code(304)
            done(null, '')
            return
        }
        done(null, payload)
    })
}

export default fp(FastEtagAsync, '3.x')
