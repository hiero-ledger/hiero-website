# Hiero Website

This repo contains the website of Hiero.

## Building the website

The project is based on [Hugo](https://gohugo.io/) and you need to [install Hugo](https://gohugo.io/installation/) to build the website along with [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/), [Tailwind CSS](https://tailwindcss.com/), and [PostCSS](https://postcss.org/)

To help ensure that tailwindcss and Hugo play nicely together, the tailwindcss integration was stitched together based on the following articles:
[Making Tailwind JIT work with Hugo](https://www.brycewray.com/posts/2021/11/making-tailwind-jit-work-hugo/)
[Making Tailwind JIT work with Hugo, the Version 3 edition](https://www.brycewray.com/posts/2022/03/making-tailwind-jit-work-hugo-version-3-edition/)


## Install packages
```
npm i 
```

## Environments

### Dev
For development run the following command in terminal.
```
npm run start
```

While the process is running the website can be reached at http://localhost:1313/.

### Production
For production ready css, run the following command in terminal.
```
npm run build
```
