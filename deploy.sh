#!/usr/bin/env sh

# abort on errors
set -e

# set git credentials
git config --global user.name "docutalk"
git config --global user.email "docu.talk.2025@gmail.com"

# build
npm run build

# navigate into the build output directory
cd dist

# remove existing git repository if it exists
rm -rf .git

# create CNAME file
echo "docutalk.co.uk" > CNAME

# initialize new git repository
git init

# set local git config
git config user.name "docutalk"
git config user.email "docu.talk.2025@gmail.com"

# add all files
git add -A

# create new commit
git commit -m "deploy to gh-pages"

# force push to gh-pages branch
git push -f git@github.com:docutalk/docutalk.git main:gh-pages

cd - 