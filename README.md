## EtherFi Sync Client

### Local development

To get setup, run the following:
- `nvm use` to select the correct node version
- `yarn` to install depedencies
- `cp .env.example .env` to get a working .env setup for testing

You should now be ready to run the program:
- `yarn start` or `node index.js`


### Docker usage

Prepare a .env that suits your environment, you will need to configure:
- ETHERFI_SC_BIDDER, the address usage in the web UI to create bids
- ETHERFI_SC_PASSWORD, the password used when generating the keys with the desktop app
- ETHERFI_SC_PRIVATE_KEYS_FILE_LOCATION, the location of the private keys generated with the desktop app

Build the image with `docker build . -t etherfi-sync-client:0.0.1` or `docker build . -t etherfi-sync-client:latest`.

To run the image as a container, use `docker run --env-file .env etherfi-sync-client:0.0.1` or `docker run --env-file .env etherfi-sync-client:latest`.