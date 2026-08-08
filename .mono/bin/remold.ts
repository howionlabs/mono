import type { MonoSetupInternal } from 'mono'
import { constructAndWriteEnvFiles } from './env'
import { readMonoSetup } from './mono'
import { cli } from './utils/cli'
import { absoluteToRelative, CWD, dirExists, readDir, resolveRootPath } from './utils/fs'

export interface RemoldOptions {
    /**
     * @default false
     */
    verbose?: boolean
}

export async function remoldWorkspacesFolder(setup: MonoSetupInternal): Promise<void> {
    const map = setup._workspacesMap
    const workspacePath = resolveRootPath('workspaces')

    // clear all workspace files first
    const allWorkspaceDirents = await readDir(workspacePath)
    const doNotTouch = new Set<string>()

    for (const [name, entries] of map.entries()) {
        const filename = `${name}.code-workspace`
        doNotTouch.add(filename)

        const codeWorkspacePath = `${workspacePath}/${name}.code-workspace`

        const folders = entries.map(entry => ({
            name: entry.id,
            path: `../zones/${entry._zone}/${entry.id}`
        }))

        const codeWorkspace = { folders } as const

        const codeWorkspaceContent = JSON.stringify(codeWorkspace, null, 4)

        const codeWorkspaceFile = Bun.file(codeWorkspacePath)
        await codeWorkspaceFile.write(codeWorkspaceContent)
    }

    for (const dirent of allWorkspaceDirents) {
        if (!doNotTouch.has(dirent.name)) {
            const filePath = `${workspacePath}/${dirent.name}`
            cli.item(`Removing previous workspace file ${absoluteToRelative(filePath)}`)
            await Bun.$`rm -f ${filePath}`.quiet()
        }
    }
}

export async function remold(
    id?: string,
    options?: RemoldOptions,
    _setup?: MonoSetupInternal
): Promise<number> {
    try {
        const opts = {
            verbose: false,
            ...options
        }

        const setup = _setup ?? (await readMonoSetup())

        if (!id) {
            cli.info('Remolding the monorepo itself...', 'green.bold').indent()
            cli.item("Set up root .env's...", 'white').indent()

            await constructAndWriteEnvFiles(
                CWD,
                setup.env.schema,
                setup.env.values,
                setup.env.valuesProduction
            )

            cli.dedent().item('Set up workspaces...', 'white').indent()

            await remoldWorkspacesFolder(setup)

            // entries

            cli.log('').reset()

            cli.info('Remolding all entries...', 'green.bold').indent()

            let exitCode = 0

            cli.reset()

            // TODO: Consider parallelizing?
            for (const entry of setup._entriesMap.values()) {
                const code = await remold(entry.id, opts, setup)

                if (code !== 0) {
                    exitCode = code
                    break
                }
            }

            if (exitCode !== 0) {
                cli.error('Remolding failed for one or more entries.', 'red.bold')
                cli.reset()
                return exitCode
            } else {
                cli.log('').success('Remolded all entries successfully!', 'green.bold').reset()
                return 0
            }
        }

        const entry = setup._entriesMap.get(id)

        if (!entry) {
            cli.error(`Entry with the identifier "${id}" could not be found.`)
            cli.reset()
            return 1
        }

        // make sure the entry path exists
        const folder = entry._path

        cli.indent().item(`${entry._zone}/${entry.id}`, 'white.bold').indent()

        if (!(await dirExists(folder))) {
            cli.item(`Create non-existent folder ${absoluteToRelative(folder)}`, 'gray.bold')
            await Bun.$`mkdir -p ${folder}`.quiet()
        }

        for (const action of entry._remoldActions) {
            if (opts.verbose) {
                cli.item(`${action.name.slice(1)}`, 'gray', '$').indent()
            }

            await action.callback(entry)

            if (opts.verbose) cli.dedent()
        }

        cli.reset()

        return 0
    } catch (e: unknown) {
        cli.handleError(e)
        return 1
    }
}
