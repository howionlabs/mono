import { env, type MonoEnv } from 'mono'

export default [
    env.number('PORT').optional.desc('The port number for the server to listen on.'),
    env.string('STRIPE_PUBLIC_KEY').optional.desc('The Public API key for Stripe integration.'),
    env.string('STRIPE_API_KEY').optional.desc('The API key for Stripe integration.').default('sk_')
    // env
    //     .boolean('MONO_GIT_TRIM')
    //     .optional.desc('')
    //     .default(true)
] as const satisfies MonoEnv
