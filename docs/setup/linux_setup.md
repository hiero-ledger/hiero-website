# Linux Setup

This guide explains how to set up the Hiero website locally on a Linux system.

## Step 1: Install Dependencies

Install Git, Node.js, and pnpm.

    sudo apt update
    sudo apt install git nodejs npm -y
    sudo npm install -g pnpm

## Step 2: Clone the Repository

Clone the repository and navigate into it:

    git clone https://github.com/hiero-ledger/hiero-website.git
    cd hiero-website

## Step 3: Install Node Packages

Install required dependencies:

    pnpm install

## Step 4: Local Development

Start the Next.js development server with live reloading:

    pnpm dev

Open your browser and visit:

    http://localhost:3000/

## Step 5: Preview Draft Content

To preview draft blog posts, just ensure the `draft` flag in your markdown front matter is respected by your application logic, and run:

    pnpm dev

## Step 6: Build for Production

To generate a production-ready build:

    pnpm build
