import chalk from 'chalk'

// all the keys of chalk that are functions
export type cliColor =
    | 'green'
    | 'red'
    | 'yellow'
    | 'blue'
    | 'gray'
    | 'white'
    | 'cyan'
    | 'magenta'
    | 'black'
    | 'whiteBright'
    | 'redBright'
    | 'greenBright'
    | 'yellowBright'
    | 'blueBright'
    | 'magentaBright'
    | 'cyanBright'
    | 'blackBright'

export const cli = {
    warn: (m: any, color: cliColor = 'yellow') => console.warn(chalk[color](`[WARN] ${m}`)),
    error: (m: any, color: cliColor = 'red') => console.error(chalk[color](`[FAIL] ${m}`)),
    info: (m: any, color: cliColor = 'blue') => console.info(chalk[color](`[INFO] ${m}`)),
    log: (m: any, color: cliColor = 'gray') => console.log(color ? chalk[color](`      ${m}`) : `      ${m}`),
    item: (m: any, color: cliColor = 'gray') => console.log(chalk[color](`       - ${m}`))
}
