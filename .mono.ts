import {
    $author,
    $biomejs,
    $bun,
    $env,
    $git,
    $license,
    $markdownlint,
    $npm,
    $static,
    $vscode,
    type MonoSetup
} from 'mono'

const $howion = $author('howion <me@howion.com> (https://howion.com)')

export default {
    zones: {
        apps: [
            // {
            //     id: 'internal-auth',
            //     name: 'Auth',
            //     description: '',
            //     version: '0.1.0',
            //     public: false,
            //     addons: [
            //         // $license(''),
            //         $howion,
            //         $vscode(),
            //         $bun(),
            //         $markdownlint(),
            //         $biomejs(),
            //         $git('https://git.howion.com/howionlabs/internal-auth.git'),
            //         $npm('@howionlabs/internal-auth'),
            //         $env('AUTH_*', 'BETTER_AUTH_*')
            //     ]
            // },
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
                    $git('https://git.howion.com/howionlabs/huid-spec.git', {
                        gitattributes: false
                    }),
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
                version: '0.1.0',
                public: false,
                description: '',
                addons: [
                    $howion,
                    $git('https://git.howion.com/howionlabs/barebone.git'),
                    $biomejs(),
                    $markdownlint(),
                    $vscode()
                ]
            },
            {
                id: 'barebone-opt',
                name: "Howion's Barbones DevOps Opt",
                version: '0.1.0',
                public: false,
                description: '',
                addons: [
                    $howion,
                    $git('https://git.howion.com/howionlabs/barebone-opt.git'),
                    $biomejs(),
                    $markdownlint()
                ]
            },
            {
                id: 'keycloak-theme',
                name: "Howion's Keycloak Theme",
                version: '0.0.1',
                public: true,
                addons: [
                    $howion,
                    $bun(),
                    $git('https://git.howion.com/howionlabs/keycloak-theme.git'),
                    $biomejs(),
                    $npm('@howionlabs/keycloak-theme'),
                    $markdownlint(),
                    $vscode(),
                    $static('assets/img/apple-touch-icon.png', 'public/apple-touch-icon.png'),
                    $static('assets/img/favicon*', 'public/favicon*'),
                    $static('assets/fonts/inter/*', 'src/login/assets/fonts/inter/*'),
                    $static('assets/img/howion-emblem-light.svg', 'src/login/*')
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
                    $static('assets/fonts/inter/*', 'public/assets/fonts/inter/*'),
                    $static('assets/img/apple-touch-icon.png', 'public/apple-touch-icon.png'),
                    $static('assets/img/favicon.*', 'public/favicon.*'),
                    $static('assets/img/howion-raw-white.svg', 'public/assets/img/logo.svg'),
                    $static('assets/img/howion-emblem-dark.svg', 'public/assets/img/logo.png')
                ]
            }
        ]
    },
    workspaces: {
        ionizer: ['ionizer', 'ui', 'utils-ts'],
        huid: ['huid-spec', 'huid-ts'],
        devops: ['barebone', 'barebone-opt', 'forgejo-custom', 'keycloak-theme']
    }
} satisfies MonoSetup
