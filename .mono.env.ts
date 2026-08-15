import { env, type MonoEnv } from 'mono'

export default [
    // AUTH
    env.number('AUTH_PORT').optional.desc('The port for the Auth service.').default(8001),
    env
        .number('AUTH_PORT_BACKEND')
        .optional.desc('The port for the Auth service backend.')
        .default(8001),
    env.string('AUTH_DATABASE_URI').required.desc('The database URI for the Auth service.'),
    env.string('AUTH_REDIS_URI').required.desc('The Redis URI for the Auth service.'),
    env
        .string('BETTER_AUTH_URL')
        .optional.desc('The URL for the BetterAuth service.')
        .default('http://localhost:3000'),
    env.string('BETTER_AUTH_SECRETS').required.desc('...,5:base64,2:base64'),
    env
        .boolean('AUTH_IS_SERVERLESS')
        .optional.desc('Whether the Auth service is running in serverless mode.')
        .default(false)
] satisfies MonoEnv
