import path from 'node:path'

export const CWD = process.cwd()

export function resolveDotMonoPath(_path: string): string {
    return path.resolve(`${CWD}/.mono/${_path}`)
}

export function resolveDotMonoStaticPath(_path: string): string {
    return resolveDotMonoPath(`static/${_path}`)
}

export function resolveAppPath(id: string): string {
    return path.resolve(`${CWD}/apps/${id}`)
}

export function resolveModulePath(id: string): string {
    return path.resolve(`${CWD}/modules/${id}`)
}

export async function readFile(absolutePath: string): Promise<string> {
    const file = Bun.file(absolutePath)

    if (!(await file.exists())) {
        throw new Error(`File not found: "${path}"`)
    }

    return await file.text()
}

// export async function upsertFile(
//     fromPath: string,
//     toPath: string,
//     checkDiff = false
// ): Promise<boolean> {
//     const from = await readFile(fromPath)

//     const to = Bun.file(toPath)

//     if (checkDiff && (await to.exists())) {
//         const fromHash = Bun.hash(from)
//         const toHash = Bun.hash(await to.text())

//         if (fromHash === toHash) {
//             return false
//         }
//     }

//     await to.write(from)
//     return true
// }
