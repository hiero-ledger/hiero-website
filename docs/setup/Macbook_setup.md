# Macbook Setup

Step 1: Install Dependencies

Open your Terminal and run the following commands:

# Install Node.js and pnpm (if not already installed)

```
brew install node
npm install -g pnpm
```

Step 2: Clone the Repository

Clone your fork of the project to your local machine:

```
git clone https://github.com/hiero-ledger/hiero-website
cd hiero-website
```

Step 3: Install Node Packages

The project uses pnpm to manage dependencies.

```
pnpm install
```

Step 4: Local Development

To start the Next.js development server with hot module reloading:

```
pnpm dev
```
Access the site: Once the command is running, open your browser to http://localhost:3000/

Step 5: Building for Production

To generate the production-ready application build:

```
pnpm build
```
