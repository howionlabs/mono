import { env, type MonoEnv } from 'mono'

export default [
    ///////////////////////////////////////////////////////////////////////////
    // AUTH
    ///////////////////////////////////////////////////////////////////////////
    env.number('AUTH_PORT').optional.desc('The port for the Auth service.').default(3000),
    env
        .boolean('AUTH_IS_SERVERLESS')
        .optional.desc('Whether the Auth service is running in serverless mode.')
        .default(false),
    env.string('AUTH_DATABASE_URI').required.desc('The database URI for the Auth service.'),
    env.string('AUTH_REDIS_URI').required.desc('The Redis URI for the Auth service.'),
    env
        .string('AUTH_BETTER_AUTH_URL')
        .optional.desc('The URL for the Auth service.')
        .default('http://localhost:3000'),
    env
        .string('AUTH_GOOGLE_CLIENT_ID')
        .required.desc('The Google client ID for OAuth authentication.'),
    env
        .string('AUTH_GOOGLE_CLIENT_SECRET')
        .required.desc('The Google client secret for OAuth authentication.'),
    env.string('AUTH_BETTER_AUTH_SECRETS').required.desc('...,5:base64,2:base64')
] satisfies MonoEnv
