import { $author, $biomejs, $git, $license, $markdownlint, $npm, $vscode, mono } from 'mono'

const $howion = $author('howion <me@howion.com> (https://howion.com)')

export default mono({
    apps: [
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
                $git('ssh://git@github.com/howionlabs/ionizer.git'),
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
                $git('ssh://git@github.com/howionlabs/huid-spec.git'),
                $license('cc-by-sa-30')
            ]
        },
        {
            id: 'huid-ts',
            name: "Howion's Unique IDentifier",
            version: '0.1.0',
            public: true,
            description:
                "The official reference implementation of Howion's Unique IDentifier in TypeScript.",
            addons: [
                $howion,
                $license('mit'),
                $vscode(),
                $markdownlint(),
                $biomejs(),
                $git('ssh://git@github.com/howionlabs/huid-ts.git'),
                $npm('@howionlabs/huid')
            ]
        }
    ]
})
