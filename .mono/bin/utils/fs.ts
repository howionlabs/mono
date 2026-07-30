import path from 'node:path'
import type { _MonoEntryInternal } from '../types'

export const CWD = process.cwd()

export function resolveRootPath(_path: string): string {
    return path.resolve(`${CWD}/${_path}`)
}

export function resolveDotMonoPath(_path: string): string {
    return resolveRootPath(`.mono/${_path}`)
}

export function resolveEntryPath(entry: _MonoEntryInternal, _path?: string): string {
    if (_path) {
        return path.resolve(`${entry.path}/${_path}`)
    } else {
        return entry.path
    }
}

export async function readJSONFile<T>(absolutePath: string): Promise<T | null> {
    const file = Bun.file(absolutePath)

    if (!(await file.exists())) {
        return null
    }

    const text = await file.text()

    return JSON.parse(text) as T
}

export async function copyFile(
    from: string | Bun.BunFile,
    to: string | Bun.BunFile,
    checkDiff = true
): Promise<boolean> {
    const fromFile = typeof from === 'string' ? Bun.file(from) : from

    if (!(await fromFile.exists())) {
        throw new Error(`Source file not found: "${fromFile.name}"`)
    }

    const fromBuffer = await fromFile.arrayBuffer()

    return await writeFile(fromBuffer, to, checkDiff)
}

export async function writeFile(
    data: string | ArrayBuffer,
    to: string | Bun.BunFile,
    checkDiff = true
): Promise<boolean> {
    const toFile = typeof to === 'string' ? Bun.file(to) : to
    const dataBuffer = typeof data === 'string' ? new TextEncoder().encode(data).buffer : data

    if (checkDiff && (await toFile.exists())) {
        const toBuffer = await toFile.arrayBuffer()

        if (dataBuffer.byteLength === toBuffer.byteLength) {
            const dataHash = Bun.hash.xxHash64(dataBuffer)
            const toHash = Bun.hash.xxHash64(toBuffer)

            if (dataHash === toHash) {
                return false
            }
        }
    }

    await toFile.write(data)

    return true
}
