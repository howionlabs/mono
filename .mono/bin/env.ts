import type { MonoEnvVariable } from './types'

export class EnvVariableBuilder<T extends 'string' | 'number' | 'boolean' = any> {
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

    default(value: T extends 'string' ? string : T extends 'number' ? number : boolean) {
        this._default = value
        return this as Omit<EnvVariableBuilder<T>, 'required' | 'optional' | 'default' | 'desc'>
    }
}

/**
 * Environment variable builder utility.
 */
export const env = {
    schema(
        variables: Omit<EnvVariableBuilder, 'required' | 'optional' | 'default' | 'desc'>[]
    ): Record<string, MonoEnvVariable> {},

    number: (name: string) =>
        new EnvVariableBuilder(name, 'number') as Omit<
            EnvVariableBuilder<'number'>,
            'default' | 'desc'
        >,

    string: (name: string) =>
        new EnvVariableBuilder(name, 'string') as Omit<
            EnvVariableBuilder<'string'>,
            'default' | 'desc'
        >,

    boolean: (name: string) =>
        new EnvVariableBuilder(name, 'boolean') as Omit<
            EnvVariableBuilder<'boolean'>,
            'default' | 'desc'
        >
}
