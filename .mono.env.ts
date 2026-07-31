import { buildEnvContents } from './.mono/bin/env'
import { env } from './.mono/mono'

const a = env.schema([
    env.number('PORT').optional.desc('The port number for the server to listen on.'),
    env.string('STRIPE_PUBLIC_KEY').optional.desc('The Public API key for Stripe integration.'),
    env.string('STRIPE_API_KEY').optional.desc('The API key for Stripe integration.').default('sk_')
])

console.log(buildEnvContents(a))
