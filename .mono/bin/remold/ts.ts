import type { MonoModule } from '../mono/mono'
import { cli, readFile, upsertFile } from '../utils'
import path from 'node:path'

export default async function mold(module: MonoModule, verbose = false) {
    const staticDir = module.staticPath

    let textReadmeMD = await readFile(path.join(staticDir, 'README.md'))
    const staticPackageJSON = (await import(path.join(staticDir, 'package.json'))).default

    const modulePackageJSONFile = Bun.file(path.join(module.path, 'package.json'))
    const moduleReadmeMDFile = Bun.file(path.join(module.path, 'README.md'))

    if (await upsertFile(path.join(staticDir, '.editorconfig'), path.join(module.path, '.editorconfig'), true)) {
        cli.item('Updating ".editorconfig"')
    } else if (verbose) {
        cli.item('".editorconfig" is up to date')
    }

    if (await upsertFile(path.join(staticDir, '.gitignore'), path.join(module.path, '.gitignore'), true)) {
        cli.item('Updating ".gitignore"')
    } else if (verbose) {
        cli.item('".gitignore" is up to date')
    }

    if (await upsertFile(path.join(staticDir, 'tsconfig.json'), path.join(module.path, 'tsconfig.json'), true)) {
        cli.item('Updating "tsconfig.json"')
    } else if (verbose) {
        cli.item('".tsconfig.json" is up to date')
    }

    if (
        await upsertFile(
            path.join(staticDir, '.markdownlint.jsonc'),
            path.join(module.path, '.markdownlint.jsonc'),
            true
        )
    ) {
        cli.item('Updating ".markdownlint.jsonc"')
    } else if (verbose) {
        cli.item('".markdownlint.jsonc" is up to date')
    }

    if (await upsertFile(path.join(staticDir, 'biome.jsonc'), path.join(module.path, 'biome.jsonc'), true)) {
        cli.item('Updating "biome.jsonc"')
    } else if (verbose) {
        cli.item('"biome.jsonc" is up to date')
    }

    if (await upsertFile(module.license.path, path.join(module.path, 'LICENSE'), true)) {
        cli.item('Updating "LICENSE"')
    } else if (verbose) {
        cli.item('"LICENSE" is up to date')
    }

    if (!(await moduleReadmeMDFile.exists())) {
        textReadmeMD = textReadmeMD
            .replaceAll('{{name}}', module.name)
            .replaceAll('{{description}}', module.description)
            .replaceAll('{{license.name}}', module.license.name)

        cli.item('Creating "README.md"')
        await moduleReadmeMDFile.write(textReadmeMD)
    } else if (verbose) {
        cli.item('"README.md" already exists, skipping creation')
    }

    staticPackageJSON.name = module.npm
    staticPackageJSON.description = module.description
    staticPackageJSON.private = !module.public
    staticPackageJSON.author.email = module.author.email
    staticPackageJSON.author.name = module.author.name
    staticPackageJSON.author.url = module.author.url

    if (module.license.npm) {
        staticPackageJSON.license = module.license.npm
    } else {
        delete staticPackageJSON.license
    }

    staticPackageJSON.keywords = module.keywords ?? []

    if (module.git) {
        staticPackageJSON.repository.url = `git+${module.git}`
    } else {
        delete staticPackageJSON.repository
    }

    if (await modulePackageJSONFile.exists()) {
        delete staticPackageJSON.version
        delete staticPackageJSON.type

        const textModulePackageJSON = await modulePackageJSONFile.text()
        const oldPackageJSON = JSON.parse(textModulePackageJSON)

        const newPackageJSON = {
            ...staticPackageJSON,
            ...oldPackageJSON,

            // override dev dependencies from static package.json, but keep any
            // additional ones from the module package.json
            devDependencies: {
                ...oldPackageJSON.devDependencies,
                ...staticPackageJSON.devDependencies
            },
            peerDependencies: {
                ...oldPackageJSON.peerDependencies,
                ...staticPackageJSON.peerDependencies
            },
            scripts: {
                ...oldPackageJSON.scripts,
                ...staticPackageJSON.scripts
            }
        }

        const textNewPackageJSON = `${JSON.stringify(newPackageJSON, null, 4)}\n`

        if (textModulePackageJSON !== textNewPackageJSON) {
            cli.item('Updating "package.json"')
            await modulePackageJSONFile.write(textNewPackageJSON)
        } else if (verbose) {
            cli.item('"package.json" is up to date')
        }
    } else {
        cli.item('Creating "package.json"')
        await modulePackageJSONFile.write(`${JSON.stringify(staticPackageJSON, null, 4)}\n`)
    }

    // await modulePackageJSONFile.write(textPackageJSON)
    // await moduleReadmeMDFile.write(textReadmeMD)
}
