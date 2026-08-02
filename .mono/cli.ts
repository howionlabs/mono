import _cac from 'cac'
import pjson from '../package.json'
import { pull } from './bin/pull'
import { remold } from './bin/remold'
import { cli } from './bin/utils/cli'

const cac = _cac('bun mono').version(pjson.version)

cac.option('-v, --verbose', 'Verbose output')

cac.command('remold', 'Remold the monorepo and its entries').action(async opts => {
    process.exitCode = await remold(undefined, {
        verbose: opts.verbose
    })
})

// cac.command('addons', 'Lists all the available addons').action(async () => {
// })

cac.command('pull').action(() => cac.outputHelp())
cac.command('commit [id]', 'Auto stage and commit all the changes')
    .option('-m, --message <message>', 'Commit message')
    .action((entryId, opts) => {
        if (!opts.message) {
            cac.outputHelp()
            return
        }
    })

cac.command('push [id]', 'Push the changes').action(async id => {
    await pull(id)
})

cac.help()

cac.parse()
