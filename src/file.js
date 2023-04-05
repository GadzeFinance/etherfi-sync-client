import fs from 'fs'

export const createFSBidOutput = (location, data, identifier) => {
    const locationWithBidIdentifier = `${location}/${identifier}`
    createDirSafe(location)
    createDirSafe(locationWithBidIdentifier)
    createWalletDir(locationWithBidIdentifier)
    createKeysDir(locationWithBidIdentifier)
    createFile(`${locationWithBidIdentifier}/wallet/wallet.txt`, data.validatorKeyPassword)
    createFile(`${locationWithBidIdentifier}//keys/keys.json`, data.validatorKeyFile)
}

const createDirSafe = (location) => {
    if (fs.existsSync(location)) {
        return;
    }
    fs.mkdirSync(`${location}`)
}

const createWalletDir = (location) => {
    const directoryToCreate = `${location}/wallet`
    if (fs.existsSync(directoryToCreate)) {
        return;
    }
    fs.mkdirSync(directoryToCreate)
}

const createKeysDir = (location) => {
    const directoryToCreate = `${location}/keys`
    if (fs.existsSync(directoryToCreate)) {
        return;
    }
    fs.mkdirSync(directoryToCreate)
}

const createFile = (location, content) => {
    fs.writeFileSync(location, content)
}