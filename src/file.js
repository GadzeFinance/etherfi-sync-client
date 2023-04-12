import fs from 'fs'

export const createFSBidOutput = (location, data, identifier, validatorPubKey) => {
    const locationWithBidIdentifier = `${location}/${identifier}`
    createDirSafe(location)
    createDirSafe(locationWithBidIdentifier)
    createFile(`${locationWithBidIdentifier}/pw.txt`, data.validatorKeyPassword)
    createFile(`${locationWithBidIdentifier}/pubkey.txt`, validatorPubKey)
    createFile(`${locationWithBidIdentifier}/${data.keystoreName}`, JSON.stringify(data.validatorKeyFile))
    
    // some assumptions are being made on the directories being used below, could be extracted to ENV variables
    const bashHeader = '#!/bin/bash -xe \n'
    const echoLine = `echo "Adding keystore to prysm for validator with pubkey:${validatorPubKey.slice(0, 10)} ..." \n`
    const changeDirectoryLine = 'cd /home/ec2-user/ethereum/consensus \n'
    const prysmCommandLine = `sudo ./prysm.sh validator accounts import --goerli --wallet-dir=/home/ec2-user/ethereum/consensus --keys-dir=/home/ec2-user/ethereum/consensus/etherfi-sync-client/storage/output`

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