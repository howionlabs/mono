/**
 * I wasn't able to achieve this functionality as changing the current working
 * directory of a child process does not affect the parent process.
 */

// import type { MonoSetupInternal } from 'mono'
// import { monoSetupPath } from './mono'
// import { cli } from './utils/cli'

// export async function cd(id: string): Promise<number> {
//     const setup: MonoSetupInternal = await import(monoSetupPath).then(m => m.default)

//     const entry = setup._entries.find(e => e.id === id)

//     if (!entry) {
//         cli.error(`Entry with the identifier "${id}" could not be found.`)
//         cli.reset()
//         return 1
//     }

//     const linkablePath = `${entry._type}s/${entry.id}`

//     // change the current working directory to the entry's path
//     process.chdir(entry._path)

//     cli.info(`Changed current working directory to the entry "${linkablePath}"`)
//     cli.reset()

//     return 0
// }
