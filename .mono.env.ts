import { env } from './.mono/mono'

export default env.schema([
    env.number('PORT').optional.desc('The port number for the server to listen on.')
])
