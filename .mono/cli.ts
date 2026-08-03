import _cac from 'cac'
import pjson from '../package.json'
import { pull } from './bin/pull'
import { remold } from './bin/remold'

const cac = _cac('bun mono').version(pjson.version)

cac.option('-v, --verbose', 'Verbose output') //.option('--dry-run', 'Dry run mode')

cac.command('remold', 'Remold the monorepo and its entries').action(async opts => {
    process.exitCode = await remold(undefined, opts)
})

// cac.command('cd <id>', 'Change directory to the entry').action(async id => {
//     process.exitCode = await cd(id)
// })

// cac.command('addons', 'Lists all available addons').action(async () => {
// })

cac.command('pull [id]').action(async (id, opts) => {
    process.exitCode = await pull(id, opts)
})

cac.command('commit [id]', 'Auto stage and commit all changes')
    .option('-m, --message <message>', 'Commit message')
    .action((id, opts) => {
        if (!opts.message) {
            cac.outputHelp()
            return
        }

        return 0
    })

cac.command('push [id]', 'Push the changes').action(async id => {
    await pull(id)
})

// cac.command('[--]', '').action(async () => {
//     cac.outputHelp()
// })

cac.help()

cac.parse()
