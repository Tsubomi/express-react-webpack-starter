# Regina's In-Browser File Explorer
Frontend only filebrowser for showcasing my thought process and code quality.

## Features
- Select/Deselect a file/directory
- Create/Remove a new file/directory
- Expand/Collapse a directory
- Known file extensions will have an associated icon
- Responsive design

### Ideas I'd like do/implement
- keyboard interaction and shortcut commands
- svg icon sprite or icon font for reducing the number of inline svg icons rendered when there are a large number of files
- unit tests
- accessibility audit
- better state management for the complex state/embedded directories
    - Consider a more granular state structure or use virtualization for large directories
    - Currently the Directory component will re-render whenever its files prop changes, even if only a single nested file changes.
    - consider storing currentDirectoryKeyPath as an array of keys instead of a comma-separated string for easier manipulation.
    - context file is a bit long, consider splitting it up so that it's smaller and easier to digest

## Dependencies
1. Install `node`
    - Use NVM (https://github.com/nvm-sh/nvm): `nvm install && nvm use`

2. Install `yarn ^1.22.0`
    - If you already have a `.nvm/default-packages` with yarn listed as a default package to install, the right version of yarn will get installed when you run `nvm install`
    - Otherwise, run `npm i -g yarn@1.22.22` to install yarn

## Usage
- Install dependencies: `yarn install`
- Build application (both frontend and backend in http://localhost:8080): `yarn build`
    - Some browser automatically redirects you to `https` so make sure to disable the automatic redirect
- Watch for changes and build application: `yarn build-watch`
- Build frontend, watch for changes and hot reload (port 8000): `yarn build-hot-reload`
    - All the backend requests will be forwarded to port 8080 so you need to run the backend
- Run application (port 8080): `yarn start`
- Run tests: `yarn test`
- Remove all the generated files: `yarn clean`
