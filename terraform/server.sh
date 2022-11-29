#!/bin/bash
export AWS_ACCESS_KEY_ID=${access_key_id}
export AWS_SECRET_ACCESS_KEY=${access_key_secret}

## Installing nvm
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

## Cloning Nightfall repo and installing the NPM version used
git clone -b ${git_branch} https://github.com/maticnetwork/nightfall_phase2ceremony.git
echo "Commit hash ${commit_hash}"

cd nightfall_phase2ceremony/serve
nvm install
nvm use

## Generating a self-signed certificate
sudo snap install --classic certbot
subdomain=$([ "${git_branch}" == "main" ] && echo "ceremony" || echo "${git_branch}.ceremony")
sudo certbot certonly --standalone --register-unsafely-without-email --agree-tos -d $subdomain.polygon-nightfall.io
cp /etc/letsencrypt/live/browser.ceremony.polygon-nightfall.io/* /nightfall_phase2ceremony/serve

## Dependencies...
npm i

## Starting app like a boss
npm run start
