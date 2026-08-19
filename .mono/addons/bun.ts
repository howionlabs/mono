import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { monoPJSON } from '../bin/constants'
import { resolveEntryPath } from '../bin/utils/fs'

async function updatePJSONForBun(entry: _MonoEntryInternal) {
    // make sure npm meta is set
    if (!entry._meta.npm?.nextPJSON) {
        throw new Error(
            `Could not update package.json for bun because npm addon is not enabled or misconfigured.`
        )
    }

    delete entry._meta.npm.nextPJSON.dependencies['@types/bun']
    delete entry._meta.npm.nextPJSON.dependencies['@types/node']
    delete entry._meta.npm.nextPJSON.dependencies.typescript
    delete entry._meta.npm.nextPJSON.dependencies['@tsconfig/bun']
    delete entry._meta.npm.nextPJSON.dependencies['@tsconfig/bun']

    entry._meta.npm.nextPJSON.devDependencies['@types/bun'] = monoPJSON.dependencies['@types/bun']
    entry._meta.npm.nextPJSON.devDependencies['@types/node'] = monoPJSON.dependencies['@types/node']
    entry._meta.npm.nextPJSON.devDependencies['@tsconfig/bun'] =
        monoPJSON.dependencies['@tsconfig/bun']
    entry._meta.npm.nextPJSON.devDependencies.typescript = monoPJSON.dependencies.typescript

    entry._meta.npm.nextPJSON.engines ??= {}
    entry._meta.npm.nextPJSON.engines.bun ??= monoPJSON.engines.bun

    const tsFile = Bun.file(resolveEntryPath(entry, 'tsconfig.json'))
    const tsFileData = {
        $schema: 'https://json.schemastore.org/tsconfig',
        extends: '@tsconfig/bun/tsconfig.json',
        compilerOptions: {
            resolveJsonModule: true,
            verbatimModuleSyntax: true,
            isolatedModules: true,
            noEmit: true,
            forceConsistentCasingInFileNames: true,
            esModuleInterop: true,
            types: ['bun', 'node']
        },
        include: ['.astro/types.d.ts', '**/*'],
        exclude: [
            '**/node_modules',
            '**/out',
            '**/build',
            '**/dist',
            '.astro',
            '.next',
            '.vercel',
            '.git'
        ]
    }

    if (await tsFile.exists()) {
        const oldFileContent = JSON.parse(await tsFile.text())

        const types = new Set([
            ...tsFileData.compilerOptions.types,
            ...(oldFileContent.compilerOptions?.types ?? [])
        ])

        const include = new Set([...tsFileData.include, ...(oldFileContent.include ?? [])])
        const exclude = new Set([...tsFileData.exclude, ...(oldFileContent.exclude ?? [])])

        const newData = {
            ...tsFileData,
            ...oldFileContent,
            compilerOptions: {
                ...tsFileData.compilerOptions,
                ...oldFileContent.compilerOptions,
                types: Array.from(types).sort()
            },
            include: Array.from(include).sort(),
            exclude: Array.from(exclude).sort()
        }

        await Bun.write(tsFile, JSON.stringify(newData, null, 4))
    } else {
        await Bun.write(tsFile, JSON.stringify(tsFileData, null, 4))
    }
}

export function $bun(): MonoAddon {
    return {
        name: $bun.name,
        unique: true,
        setup: [
            {
                order: -1,
                callback: updatePJSONForBun
            }
        ]
    }
}
