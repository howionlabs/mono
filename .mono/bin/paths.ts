import path from 'node:path'
import fs from 'node:fs'

export const pwd = process.cwd()

export const modulesDirPath = path.join(pwd, 'modules')
export const appsDirPath = path.join(pwd, 'apps')
export const moldStaticsDirPath = path.join(pwd, 'static/molds')
export const licensesDirPath = path.join(pwd, 'static/licenses')

export const rootMonoTOMLPath = path.join(pwd, 'mono.toml')
export const rootPackageJSONPath = path.join(pwd, 'package.json')

export function readSubdirsSync(_path: string): string[] {
    return fs.readdirSync(_path).filter((file) => {
        const subdirPath = path.join(_path, file)
        return fs.statSync(subdirPath).isDirectory()
    })
}

export const moduleDirs = readSubdirsSync(modulesDirPath)
export const appDirs = readSubdirsSync(appsDirPath)
export const moldStaticDirs = readSubdirsSync(moldStaticsDirPath)
export const licenseDirs = readSubdirsSync(licensesDirPath)
