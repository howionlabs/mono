import { $author, $biomejs, $bun, $git, $license, $markdownlint, $npm, $static, $vscode, type MonoSetup } from 'mono'

const $howion = $author('howion <me@howion.com> (https://howion.com)')

export default {
    zones: {
        apps: [
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
        personal: []
    },
    workspaces: {
        brand: ['howion.com', 'ui']
    }
} satisfies MonoSetup
