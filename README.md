# mono

Howion's custom (and quite opinionated) monorepo to manage all of its (public and private) [**@howionlabs**](http://github.com/howionlabs) repositories.

## Motivation

None of the existing monorepo tools or structures were good enough and always resulted writing custom scripts. Google's Bazel seemed like a solid choice but the complexity and management of it wasn't worth it. Therefore, hereby we represent our custom monorepo (skeleton) by us for us.

This monorepo is currently is being used by us therefore, especially `.mono.ts`, is subject to change. You probably just don't get to see `apps` and `modules` contents unless you have access to relative (sub)repositories.

## Folder Structure

* **`.mono`** for monorepo-related scripts
    * **`.mono/static`** for static files such as opinionated `.gitignore`'s etc. to be copied/upserted into `apps` and `modules` depending on their configuration.
* (git-ignored) **`apps`** for apps
* (git-ignored) **`modules`** for modules that are possibly seperate projects which could be accessed from `apps` or from other `modules`.
* **`.mono.ts`** is the configuration file to customize the setup.
* **`.editorconfig`**, **`.gitignore`**, **`.markdownlint.jsonc`**, and **`biome.jsonc`** are opinionated configurations whose definitions should match of those in `apps` and `modules`.

## Mono Addons

## Mono CLI

## Roadmap

1. Better secret management via `env` addon instead of relying manual per-repository .env management.

## License

The code related to the monorepo skeleton (which excludes the contents of git-ignored `apps` and `modules` folders that contain proprietary/private code) is licensed under the [MIT License](./LICENSE).
