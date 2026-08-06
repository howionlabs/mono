import { $author, $biomejs, $git, $license, $markdownlint, $npm, $vscode, mono } from 'mono'

const $howion = $author({
    email: 'me@howion.com',
    name: 'howion',
    url: 'https://howion.com'
})

export default mono({
    apps: [
        {
            id: 'ionizer-vite',
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
                $git('howionlabs', 'ionizer-vite', 'ssh'),
                $npm('@howionlabs/ionizer')
            ]
        }
    ],
    modules: [
        {
            id: 'huid-spec',
            name: "Howion's Unique IDentifier",
            version: '0.1.0',
            public: true,
            description: "RFC-like specification of Howion's Unique IDentifier (HUID)",
            addons: [
                $howion,
                $markdownlint(),
                $git('howionlabs', 'huid-spec', 'ssh'),
                $license('cc-by-sa-30')
            ]
        },
        {
            id: 'huid-ts',
            name: "Howion's Unique IDentifier",
            version: '0.1.0',
            public: true,
            description:
                "The official reference implementation in TypeScript for Howion's Unique IDentifier.",
            addons: [
                $howion,
                $license('mit'),
                $vscode(),
                $markdownlint(),
                $biomejs(),
                $git('howionlabs', 'huid-ts', 'ssh'),
                $npm('@howionlabs/huid')
            ]
        }
    ]
})
