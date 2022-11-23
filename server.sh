#!/bin/bash
export AWS_ACCESS_KEY_ID=${access_key_id}
export AWS_SECRET_ACCESS_KEY=${access_key_secret}

## Installing nvm
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

## Cloning Nightfall repo and installing the NPM version used
git clone -b zepedro/mpc2 https://github.com/maticnetwork/nightfall_phase2ceremony.git
cd nightfall_phase2ceremony/serve
nvm install
nvm use

npm i
npm run start
