import _cac from 'cac'
import pjson from '../package.json'
import { remold } from './bin/remold'

const cac = _cac('bun run')

cac.command('remold [module]', 'Remolds all the modules unless [module] is specified')
    .option('-v, --verbose', 'Verbose output')
    .action((p, options) =>
        remold(p, {
            verbose: options.verbose
        })
    )

cac.help()
cac.version(pjson.version)
cac.parse()
