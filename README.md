## EtherFi Sync Client

### Local development

To get setup, run the following:
- `nvm use` to select the correct node version
- `yarn` to install depedencies
- `cp .env.example .env` to get a working .env setup for testing

You should now be ready to run the program:
- `npm start`
- `source .env && yarn start`
- `source .env && node index.js`


### Docker usage

Prepare a .env that suits your environment, you will need to configure:
- ETHERFI_SC_BIDDER, the address used in the web UI to create bids
- ETHERFI_SC_PASSWORD, the password used when generating the keys with the desktop app
- ETHERFI_SC_PRIVATE_KEYS_FILE_LOCATION, the location of the private keys generated with the desktop app

Build the image with `docker build . -t etherfi-sync-client:0.0.1` or `docker build . -t etherfi-sync-client:latest`.

To run the image as a container, use `docker run --env-file .env etherfi-sync-client:0.0.1` or `docker run --env-file .env etherfi-sync-client:latest`.


### Docker compose usage

Create a `storage directory` with two sub directories, `input` & `output`.
In the `input` directory include the keys generated from desktop app for NO.
- privateEtherfiKeystore-1681395800316.json
- publicEtherfiKeystore-1681395800301.json

Ensure environment is correct for variables:
- ETHERFI_SC_IPFS_GATEWAY (probably ok)
- ETHERFI_SC_GRAPH_URL (probably ok)
- ETHERFI_SC_OUTPUT_LOCATION (probably ok)
- ETHERFI_SC_BIDDER (most likely to change)
- ETHERFI_SC_PRIVATE_KEYS_FILE_LOCATION (most likely to change)
- ETHERFI_SC_PASSWORD (most likely to change)

Run locally to iterate on code with `docker compose up --build` which will rebuild everything each time.

Run on ec2 instance by creating tar and shipping via scp to ec2, with:
- local machine `tar --exclude="node_modules" --exclude="storage/output" --exclude=".git" -czvf sync-client.tar.gz etherfi-sync-client`
- local machine `scp -i etherfi-staking.pem sync-client.tar.gz ec2-user@ec2-52-221-193-254.ap-southeast-1.compute.amazonaws.com:/home/ec2-user/ethereum/consensus/`
- ec2 instance `tar -xzvf sync-client.tar.gz`
- ec2 instance `rm sync-client.tar.gz`
- ec2 instance `cd etherfi-sync-client`
- ec2 instance `docker-compose up -d --build`
- ec2 instance, once keys are populated into `storage/out/XXX`, go into each and run script to add key to prysm.

### Future potential improvements

- cleanup how .env and env variables are used in general
- detect private key file in directory at ETHERFI_SC_PRIVATE_KEYS_FILE_LOCATION instead of needing to specify exact file, although it creates bigger error surface, so might not be best idea, just a PITA when doing multiple tests where different files are being used, but not a biggie
- run something along the lines of "sudo ./prysm.sh validator accounts list --goerli --wallet-dir=/home/ec2-user/ethereum/consensus" programmatically and record output, compare with validators on subgraph and check that all states match
- fuckit, make whole app a golang binary instead, more powerful and more portable, only downside is amount of developers that know golang, so bus factor increases a bit


### Useful commands

Run the following from the directory `/home/ec2-user/ethereum/consensus`

- List accounts `sudo ./prysm.sh validator accounts list --goerli --wallet-dir=/home/ec2-user/ethereum/consensus` (password = fakepassbro)
- Import new keystore `sudo ./prysm.sh validator accounts import --goerli --wallet-dir=/home/ec2-user/ethereum/consensus --keys-dir=/home/ec2-user/ethereum/consensus/validator_keys/keystore-m_12381_3600_0_0_0-1681300318.json`

The above commands are also found in easy to use scripts in the `/staking-scripts` directory

### Good docs to read for more understanding

https://docs.prylabs.network/docs/how-prysm-works/validator-lifecycle

https://docs.prylabs.network/docs/wallet/nondeterministic