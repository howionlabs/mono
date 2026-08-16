import {
    $author,
    $biomejs,
    $env,
    $git,
    $license,
    $markdownlint,
    $npm,
    $static,
    $vscode,
    type MonoSetup
} from 'mono'
import { $bun } from './.mono/addons/bun'

const $howion = $author('howion <me@howion.com> (https://howion.com)')

export default {
    zones: {
        apps: [
            {
                id: 'internal-auth',
                name: 'Auth',
                description: '',
                version: '0.1.0',
                public: false,
                addons: [
                    // $license(''),
                    $howion,
                    $vscode(),
                    $bun(),
                    $markdownlint(),
                    $biomejs(),
                    // $git('ssh://git@github.com/howionlabs/ionizer.git'),
                    $npm('@howionlabs/internal-auth'),
                    $env('AUTH_*', 'BETTER_AUTH_*')
                ]
            },
            {
                id: 'ionizer',
                name: 'Ionizer',
                description: '',
                version: '0.1.0',
                public: false,
                addons: [
                    // $license(''),
                    $howion,
                    $vscode(),
                    $markdownlint(),
                    $biomejs(),
                    // $git('ssh://git@github.com/howionlabs/ionizer.git'),
                    $npm('@howionlabs/ionizer')
                ]
            }
        ],
        modules: [
            {
                id: 'ui',
                name: 'Howion UI',
                description: 'Collection of common user interface components of Howion ecosystem',
                version: '0.1.0',
                public: false,
                addons: [
                    // $license(''),
                    $howion,
                    $vscode(),
                    $markdownlint(),
                    $biomejs(),
                    // $git('ssh://git@github.com/howionlabs/ionizer.git'),
                    $npm('@howionlabs/ui')
                ]
            },
            {
                id: 'utils-ts',
                name: "Howion's Typescript Utilities",
                version: '0.1.0',
                addons: [
                    $howion,
                    $git('https://git.howion.com/howionlabs/utils-ts.git'),
                    $license('mit'),
                    $biomejs(),
                    $markdownlint(),
                    $vscode
                ]
            },
            {
                id: 'huid-spec',
                name: "Howion's Unique IDentifier",
                version: '1.0.0',
                public: true,
                description: "RFC-like specification of Howion's Unique IDentifier (HUID)",
                addons: [
                    $howion,
                    $git('https://git.howion.com/howionlabs/huid-spec.git'),
                    $license('cc-by-sa-30'),
                    $markdownlint()
                ]
            },
            {
                id: 'huid-ts',
                name: "Howion's Unique IDentifier",
                version: '1.0.1',
                public: true,
                description:
                    "The official reference implementation of Howion's Unique IDentifier in TypeScript.",
                addons: [
                    $howion,
                    $git('https://git.howion.com/howionlabs/huid-ts.git'),
                    $license('mit'),
                    $npm('@howionlabs/huid'),
                    $biomejs(),
                    $markdownlint(),
                    $vscode()
                ]
            }
        ],
        devops: [
            {
                id: 'barebone',
                name: "Howion's Barebones DevOps",
                version: '0.0.1',
                public: false,
                description: '',
                addons: [
                    $howion,
                    $git('https://git.howion.com/howionlabs/devops-barebone.git'),
                    $biomejs(),
                    $markdownlint(),
                    $vscode()
                ]
            },
            {
                id: 'forgejo-custom',
                name: "Howion's Forgejo Customization",
                version: '0.0.1',
                public: true,
                addons: [
                    $howion,
                    $git('https://git.howion.com/howionlabs/forgejo-custom.git'),
                    $biomejs(),
                    $npm('@howionlabs/forgejo-custom'),
                    $markdownlint(),
                    $vscode(),
                    $static('assets/favicon.svg', 'public/assets/img/favicon.svg'),
                    $static('assets/favicon.png', 'public/assets/img/favicon.png'),
                    $static('assets/howion-raw-white.svg', 'public/assets/img/logo.svg'),
                    $static('assets/howion-emblem-dark.svg', 'public/assets/img/logo.png')
                ]
            }
        ]
    },
    workspaces: {
        ionizer: ['ionizer', 'ui', 'utils-ts'],
        huid: ['huid-spec', 'huid-ts'],
        devops: ['barebone'],
        auth: ['internal-auth']
    }
} satisfies MonoSetup
