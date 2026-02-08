# Linux Setup

This guide explains how to set up the Hiero website locally on a Linux system.

## Step 1: Install Dependencies

Install Git, Node.js, npm, and Hugo (extended).

    sudo apt update
    sudo apt install git nodejs npm -y
    sudo snap install hugo --channel=extended

## Step 2: Clone the Repository

Clone the repository and navigate into it:

    git clone https://github.com/hiero-ledger/hiero-website.git
    cd hiero-website

## Step 3: Install Node Packages

Install required npm dependencies:

    npm install

## Step 4: Local Development

Start the Hugo development server with live reloading:

    npm run start

Open your browser and visit:

    http://localhost:1313/

## Step 5: Preview Draft Content

To preview draft blog posts:

    hugo server --buildDrafts

## Step 6: Build for Production

To generate a production-ready build:

    npm run build

