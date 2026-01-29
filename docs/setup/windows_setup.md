# Windows Setup

## Instructions

### Install packages

Run these commands: 

```npm i ```
```npm install  --save-dev cross-env npm install```
```npm install --save-dev rimraf ```

### Update Package.Json

Navigate to your package.json file

Remove the current script section and replace it with the code below:

```
"scripts": {
    "clean": "rimraf public",
    "start": "cross-env TAILWIND_MODE=watch NODE_ENV=development npm-run-all clean prelim:twcss --parallel dev:*",
    "build": "NODE_ENV=production npm-run-all clean prelim:twcss prod:*",
    "prelim:twcss": "npx tailwindcss -i ./assets/css/main.css -o ./static/css/main.css --jit",
    "dev:twcssw": "npx tailwindcss -i ./assets/css/main.css -o ./static/css/main.css --jit -w",
    "dev:hugo": "hugo server",
    "prod:twcss": "./node_modules/tailwindcss/lib/cli.js -i ./assets/css/main.css -o ./static/css/main.css --jit --minify",
    "prod:hugo": "hugo --gc --minify"
  },
```
Save the file.

### Run Start Command

Run ```npm run start``` to spin up the local server.

You should see ```Web Server is available at http://localhost:1313/```

Open this link to see the project 

You have just setup Hiero-Website locally!!