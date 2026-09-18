import { env, type MonoEnv } from 'mono'

export default [
    // AUTH
    env.string('AUTH_DATABASE_URI').required.desc('The database URI for the Auth service.'),
    env.string('AUTH_REDIS_URI').required.desc('The Redis URI for the Auth service.'),
    env.string('AUTH_GOOGLE_CLIENT_ID').required.desc('The Google client ID for OAuth authentication.'),
    env.string('AUTH_GOOGLE_CLIENT_SECRET').required.desc('The Google client secret for OAuth authentication.')
] satisfies MonoEnv
