import type { _MonoEnvInternal, MonoEnvMap, MonoEnvValueMap, MonoEnvVariable } from './types'
import { parse } from 'dotenv'
import {
    ENV_DEFAULT_LINE_WIDTH,
    ENV_NAME_REGEX,
    MONO_AUTOGEN_DISCLAIMER,
    MONO_HASHTAG_BAR,
    monoEnvPath,
    rootEnvFile,
    rootEnvProductionFile
} from './constants'
import { cli } from './utils/cli'
import { breakTextToLines } from './utils/misc'

export function renderFormat(variable: MonoEnvVariable): string {
    let format = ''

    if (variable._required) {
        format += '@required'
    } else {
        format += '@optional'
    }

    if (variable._type === 'text') {
        format += '.text'
    } else if (variable._type === 'number') {
        format += '.number'
    } else if (variable._type === 'boolean') {
        format += '.boolean'
    }

    if (!variable._required) {
        if (variable._default !== undefined) {
            format += `.default(${renderValue(variable._default)})`
        }
    }

    return format
}

export function renderValue(value: string | number | boolean): string {
    if (typeof value === 'string') {
        return `"${value}"`
    } else if (typeof value === 'number') {
        return value.toString()
    } else {
        return value ? 'true' : 'false'
    }
}

export function renderH1(text: string): string {
    let result = `## ${text} `
    result += '#'.repeat(ENV_DEFAULT_LINE_WIDTH - 1 - result.length)
    return result
}

export function readEnvFile(source: string | Buffer, schema: MonoEnvMap): MonoEnvValueMap {
    const result: MonoEnvValueMap = new Map()

    const parsed = parse(source)

    for (const [key, value] of Object.entries(parsed)) {
        if (!schema.has(key)) {
            // throw new Error(`Unknown environment variable: "${key}"`)
            continue
        }

        const variable = schema.get(key)!

        if (value.trim() !== '') {
            if (variable._type === 'text') {
                result.set(key, value)
            } else if (variable._type === 'number') {
                const numberValue = Number(value)

                if (Number.isNaN(numberValue)) {
                    throw new Error(
                        `Invalid value for the environment variable "${key}". Expected number, got "${value}".`
                    )
                }

                result.set(key, numberValue)
            } else if (variable._type === 'boolean') {
                const lowerValue = value.toLowerCase()

                if (lowerValue === 'true') {
                    result.set(key, true)
                } else if (lowerValue === 'false') {
                    result.set(key, false)
                } else {
                    throw new Error(
                        `Invalid value for the environment variable "${key}". Expected "true" or "false", got "${value}".`
                    )
                }
            }
        }
    }

    // make sure all required variables are present
    const requireds = [...schema.values()].filter(variable => variable._required)

    for (const required of requireds) {
        if (!result.has(required._name)) {
            // throw new Error(`Missing required environment variable: "${required._name}"`)
            result.set(
                required._name,
                required._default ??
                    (required._type === 'text' ? '' : required._type === 'number' ? 0 : false)
            )
        }
    }

    const optionals = [...schema.values()].filter(variable => !variable._required)

    for (const optional of optionals) {
        if (!result.has(optional._name) && optional._default !== undefined) {
            result.set(optional._name, optional._default)
        }
    }

    return result
}

export function buildEnv(schema: MonoEnvMap, valueMap?: MonoEnvValueMap): string {
    let result = ``

    result += MONO_HASHTAG_BAR
    result += `\n${MONO_AUTOGEN_DISCLAIMER}\n`
    result += MONO_HASHTAG_BAR
    result += `\n`

    // a -> z
    const sorted = [...schema.values()].sort((a, b) => a._name.localeCompare(b._name, 'en'))

    // to section the variables by the first component of the
    // underscore-separated name.
    let startsWith: string = ''

    for (const i in sorted) {
        const variable = sorted[i]!
        const head = variable._name.split('_')[0]!
        const nextVariable = sorted[Number(i) + 1]
        let nextHead: string | null = null

        if (nextVariable) {
            nextHead = nextVariable._name.split('_')[0]!
        }

        result += '\n'

        if (head !== startsWith) {
            startsWith = head

            // we have started a new section. check if it has more than one
            // variable in it and if so render a header

            if (nextHead === head) {
                result += renderH1(head)
                result += '\n\n'
            }
        }

        const format = renderFormat(variable)

        if (variable._description) {
            const description = breakTextToLines(variable._description, ENV_DEFAULT_LINE_WIDTH - 3)
                .map(line => `# ${line}`)
                .join('\n')

            result += `${description}\n`
        }

        result += `# ${format}\n`

        result += `${variable._name}=`

        let value: string | number | boolean | undefined

        if (valueMap?.has(variable._name)) {
            value = valueMap.get(variable._name)
        }

        if (value === undefined) {
            if (variable._default !== undefined) {
                result += renderValue(variable._default)
            }
        } else {
            result += renderValue(value)
        }

        result += '\n'
    }

    result = result.trimEnd()
    result += '\n'

    return result
}

export async function constructAndWriteEnvFiles(
    absoluteBasePath: string,
    schema: MonoEnvMap,
    valueMap?: MonoEnvValueMap,
    valueMapProduction?: MonoEnvValueMap
): Promise<void> {
    const envFile = Bun.file(`${absoluteBasePath}/.env`)
    const envExampleFile = Bun.file(`${absoluteBasePath}/.env.example`)
    const envProductionFile = Bun.file(`${absoluteBasePath}/.env.production`)

    const envContent = buildEnv(schema, valueMap)
    const envExampleContent = buildEnv(schema, undefined)
    const envProductionContent = buildEnv(schema, valueMapProduction)

    await envFile.write(envContent)
    await envExampleFile.write(envExampleContent)
    await envProductionFile.write(envProductionContent)
}

export type MonoEnvBuilderVariable = Omit<
    EnvVariableBuilder<'text' | 'number' | 'boolean'>,
    'required' | 'optional' | 'default' | 'desc'
>

/**
 * Environment variable builder utility.
 */
export const env = {
    number: (name: string) =>
        new EnvVariableBuilder(name, 'number') as Omit<
            EnvVariableBuilder<'number'>,
            'default' | 'desc'
        >,

    string: (name: string) =>
        new EnvVariableBuilder(name, 'text') as Omit<
            EnvVariableBuilder<'text'>,
            'default' | 'desc'
        >,

    boolean: (name: string) =>
        new EnvVariableBuilder(name, 'boolean') as Omit<
            EnvVariableBuilder<'boolean'>,
            'default' | 'desc'
        >
}

export class EnvVariableBuilder<T extends 'text' | 'number' | 'boolean'> {
    protected readonly _name: string = ''
    protected _description?: string
    protected _required: boolean = true
    protected readonly _type: MonoEnvVariable['_type']
    protected _default?: string | number | boolean

    constructor(name: string, type: T) {
        this._name = name
        this._type = type
    }

    desc(description: string) {
        if (description.trim() !== description) {
            throw new Error(
                `Invalid description for the environment variable "${this._name}". Must not have leading or trailing whitespace.`
            )
        }

        this._description = description

        return this as Omit<EnvVariableBuilder<T>, 'required' | 'optional' | 'desc'>
    }

    get required() {
        this._required = true
        return this as Omit<EnvVariableBuilder<T>, 'required' | 'optional' | 'default'>
    }

    get optional() {
        this._required = false
        return this as Omit<EnvVariableBuilder<T>, 'required' | 'optional' | 'default'>
    }

    default(value: T extends 'text' ? string : T extends 'number' ? number : boolean) {
        if (
            (this._type === 'text' && typeof value !== 'string') ||
            (this._type === 'number' && typeof value !== 'number') ||
            (this._type === 'boolean' && typeof value !== 'boolean')
        ) {
            throw new Error(
                `Invalid default value for the environment variable "${this._name}". Expected ${this._type}, got ${typeof value}.`
            )
        }

        this._default = value

        return this as Omit<EnvVariableBuilder<T>, 'required' | 'optional' | 'default' | 'desc'>
    }

    /**
     * Internal method to retrieve the internal representation of the
     * environment variable.
     */
    __internal(): MonoEnvVariable {
        return {
            _name: this._name,
            _description: this._description,
            _required: this._required,
            _type: this._type,
            _default: this._default
        }
    }
}

export type MonoEnv = readonly MonoEnvBuilderVariable[]

export async function readMonoEnv(): Promise<_MonoEnvInternal> {
    try {
        const monoEnvBuilderVariables: MonoEnv = await import(monoEnvPath).then(
            module => module.default
        )

        const envSchema: MonoEnvMap = new Map()

        for (const variable of monoEnvBuilderVariables) {
            const internal = variable.__internal()

            if (envSchema.has(internal._name)) {
                throw new Error(`Duplicate environment variable name: "${internal._name}"`)
            }

            if (internal._name.trim() !== internal._name) {
                throw new Error(
                    `Invalid environment variable name: "${internal._name}". Must not have leading or trailing whitespace.`
                )
            }

            // name must be uppercase ascii letters, numbers, and underscores only
            if (!ENV_NAME_REGEX.test(internal._name)) {
                throw new Error(
                    `Invalid environment variable name: "${internal._name}". Must be non-empty uppercase ASCII letters, numbers, and underscores only.`
                )
            }

            envSchema.set(internal._name, internal)
        }

        let envValueMap: MonoEnvValueMap | undefined
        let envValueMapProduction: MonoEnvValueMap | undefined

        if (await rootEnvFile.exists()) {
            const envContent = await rootEnvFile.text()
            envValueMap = readEnvFile(envContent, envSchema)
        }

        if (await rootEnvProductionFile.exists()) {
            const envContent = await rootEnvProductionFile.text()
            envValueMapProduction = readEnvFile(envContent, envSchema)
        }

        return {
            schema: envSchema,
            values: envValueMap,
            valuesProduction: envValueMapProduction
        }
    } catch (e: unknown) {
        cli.handleError(e)
        process.exit(1)
    }
}
