import { cli } from './cli'

// export const ROOT_ABSOLUTE_PATH =

export function resolveDotMono(path: string): string {}

export function resolveEntry(path: string): string {}

export function resolveStatic(path: string): string {}

export async function readFile(path: string): Promise<string> {
    try {
        const file = Bun.file(path)

        if (!(await file.exists())) {
            throw new Error(`File not found: "${path}"`)
        }

        return await file.text()
    } catch (e: unknown) {
        cli.error(e instanceof Error ? e.message : String(e))
        throw e
    }
}

export async function upsertFile(
    fromPath: string,
    toPath: string,
    checkDiff = false
): Promise<boolean> {
    const from = await readFile(fromPath)

    const to = Bun.file(toPath)

    if (checkDiff && (await to.exists())) {
        const fromHash = Bun.hash(from)
        const toHash = Bun.hash(await to.text())

        if (fromHash === toHash) {
            return false
        }
    }

    await to.write(from)
    return true
}
