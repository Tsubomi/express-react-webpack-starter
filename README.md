# Regina's In-Browser File Explorer
Frontend only filebrowser for showcasing my thought process and code quality.

## Features
- Select/Deselect a file/directory
- Create/Remove a new file/directory
- Expand/Collapse a directory
- Known file extensions will have an associated icon
- Responsive design

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
