import fs from 'fs'
import { getConfig } from './config.js'

export const createFSBidOutput = (location, data, identifier, validatorPubKey) => {

    const { ETHERFI_SC_CONSENSUS_LOCATION, ETHERFI_SC_CLIENT_LOCATION } = getConfig()

    const locationWithBidIdentifier = `${location}/${identifier}`
    createDirSafe(location)
    createDirSafe(locationWithBidIdentifier)
    createFile(`${locationWithBidIdentifier}/pw.txt`, data.validatorKeyPassword)
    createFile(`${locationWithBidIdentifier}/pubkey.txt`, validatorPubKey)
    createFile(`${locationWithBidIdentifier}/${data.keystoreName}`, JSON.stringify(data.validatorKeyFile))
    
    // some assumptions are being made on the directories being used below, could be extracted to ENV variables
    const bashHeader = '#!/bin/bash -xe \n'
    const echoLine = `echo "Adding keystore to prysm for validator with pubkey:${validatorPubKey.slice(0, 10)} ..." \n`
    const changeDirectoryLine = `cd ${ETHERFI_SC_CONSENSUS_LOCATION} \n`
    const prysmCommandLine = `sudo ./prysm.sh validator accounts import --goerli --wallet-dir=${ETHERFI_SC_CONSENSUS_LOCATION} --keys-dir=${ETHERFI_SC_CLIENT_LOCATION}/storage/output`

    createFile(`${locationWithBidIdentifier}/add.sh`, `${bashHeader} ${echoLine} ${changeDirectoryLine} ${prysmCommandLine}/${identifier}/${data.keystoreName}`)
}

const createDirSafe = (location) => {
    if (fs.existsSync(location)) {
        return
    }
    fs.mkdirSync(`${location}`)
}

const createFile = (location, content) => {
    if (fs.existsSync(location)) {
        return
    }
    fs.writeFileSync(location, content)
}