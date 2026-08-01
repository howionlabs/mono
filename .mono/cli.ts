import _cac from 'cac'
import pjson from '../package.json'
import { remold } from './bin/remold'

const cac = _cac('bun run')

cac.command('remold [entry]', 'Remolds all the modules unless [entry] is specified')
    .option('-v, --verbose', 'Verbose output')
    .action(
        async (p, options) =>
            (process.exitCode = await remold(p, {
                verbose: options.verbose
            }))
    )

cac.help()
cac.version(pjson.version)
cac.parse()
