Step 1: Install Dependencies

Open your Terminal and run the following commands:

# Install Node.js and npm (if not already installed)
brew install node

# Install the Hugo 'extended' version (required for Tailwind/Sass)
brew install hugo

Step 2: Clone the Repository

Clone your fork of the project to your local machine:

git clone https://github.com/hiero-ledger/hiero-website
cd hiero-website

Step 3: Install Node Packages

The project uses npm to manage CSS processing tools.

npm i

Step 4: Local Development

To start the Hugo development server with live reloading:

npm run start

Access the site: Once the command is running, open your browser to http://localhost:1313/

Step 5: Building for Production

To generate the static site with optimized and minified CSS:

npm run build
