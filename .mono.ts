import { $author, $biomejs, $bun, $git, $license, $markdownlint, $npm, $static, $vscode, type MonoSetup } from 'mono'

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
            //         $npm('@howionlabs/internal-auth'),
            //         $git('https://git.howion.com/howionlabs/internal-auth.git'),
            //         $env('AUTH_*', 'BETTER_AUTH_*')
            //     ]
            // },
            {
                id: 'howion.com',
                name: 'howion.com',
                description: '',
                version: '2.2.0',
                public: true,
                addons: [
                    $license('mit'),
                    $howion,
                    $bun(),
                    $vscode(),
                    $markdownlint(),
                    $biomejs(),
                    $git('https://git.howion.com/howionlabs/howion.com.git'),
                    $npm('@howionlabs/howion.com')
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
                    $vscode()
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
                description: "The official reference implementation of Howion's Unique IDentifier in TypeScript.",
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
                    $markdownlint(),
                    // opengist
                    $static('assets/img/favicon.png', 'opengist/custom/favicon.png'),
                    $static('assets/img/howion-emblem-light.svg', 'opengist/custom/logo.svg'),
                    // vaultwarden
                    $static('assets/img/howion-raw-black.png', 'vaultwarden/custom/images/icon-dark.png'),
                    $static('assets/img/howion-raw-white.png', 'vaultwarden/custom/images/icon-white.png'),
                    $static('assets/img/favicon-96x96.png', 'vaultwarden/custom/images/logo-dark@2x.png'),
                    $static('assets/img/favicon-white-96x96.png', 'vaultwarden/custom/images/logo-white@2x.png'),
                    $static('assets/img/howion-raw-white.svg', 'vaultwarden/custom/images/icon-white.svg'),
                    $static('assets/img/howion-emblem-dark.svg', 'vaultwarden/custom/images/logo.svg'),
                    $static('assets/img/howion-emblem-light.svg', 'vaultwarden/custom/images/logo-white.svg'),
                    $static('assets/img/howion-emblem-light.svg', 'vaultwarden/custom/images/howion-emblem-light.svg'),
                    // vaultwarden/icons
                    $static('assets/img/favicon.ico', 'vaultwarden/custom/images/favicon.ico'),
                    $static(
                        'assets/img/web-app-manifest-white-192x192.png',
                        'vaultwarden/custom/images/android-chrome-192x192.png'
                    ),
                    $static(
                        'assets/img/web-app-manifest-white-512x512.png',
                        'vaultwarden/custom/images/android-chrome-512x512.png'
                    ),
                    $static('assets/img/apple-touch-icon-white.png', 'vaultwarden/custom/images/apple-touch-icon.png'),
                    $static('assets/img/favicon-white-16x16.png', 'vaultwarden/custom/images/favicon-16x16.png'),
                    $static('assets/img/favicon-white-32x32.png', 'vaultwarden/custom/images/favicon-32x32.png'),
                    $static('assets/img/mstile-white-150x150.png', 'vaultwarden/custom/images/mstile-150x150.png'),
                    $static('assets/img/howion-emblem-light.svg', 'vaultwarden/custom/images/safari-pinned-tab.svg')
                ]
            },
            {
                id: 'keycloak-theme',
                name: "Howion's Keycloak Theme",
                version: '0.0.1',
                public: true,
                addons: [
                    $howion,
                    $license('mit'),
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
                    $license('mit'),
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
        ],
        personal: [
            {
                id: 'comprimo',
                name: 'The Ultimate Compression Toolkit',
                version: '0.1.0',
                addons: [
                    $howion,
                    $git('https://git.howion.com/howion/comprimo.git'),
                    $license('mit'),
                    $markdownlint(),
                    $vscode()
                ]
            },
            {
                id: 'speculo',
                name: 'P2P mobile to desktop device orientation mirroring.',
                version: '1.0.0',
                addons: [
                    $howion,
                    $git('https://git.howion.com/howion/speculo.git'),
                    $license('mit'),
                    $markdownlint(),
                    $bun(),
                    $vscode(),
                    $biomejs(),
                    $npm('speculojs'),
                    $static('assets/img/favicon.ico', 'public/favicon.ico'),
                    $static('assets/fonts/inter/*', 'public/assets/fonts/inter/*')
                ]
            }
        ]
    },
    workspaces: {
        ionizer: ['ionizer', 'ui', 'utils-ts'],
        huid: ['huid-spec', 'huid-ts'],
        devops: ['barebone', 'barebone-opt', 'forgejo-custom', 'keycloak-theme'],
        personal: ['comprimo', 'speculo']
    }
} satisfies MonoSetup
