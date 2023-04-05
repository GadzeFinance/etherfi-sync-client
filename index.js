import { fetchFromIpfs } from './src/ipfs.js'
import { createFSBidOutput } from './src/file.js'
import { extractPrivateKeysFromFS, getKeyPairByPubKeyIndex, decryptKeyPairJSON, decryptValidatorKeyInfo } from './src/decrypt.js'
import { getConfig } from './src/config.js'
import { retrieveBidsFromSubgraph } from './src/subgraph.js'

async function run() {

  const {
    GRAPH_URL,
    BIDDER,
    PRIVATE_KEYS_FILE_LOCATION,
    OUTPUT_LOCATION,
    PASSWORD,
  } = getConfig()

  const privateKeys = extractPrivateKeysFromFS(PRIVATE_KEYS_FILE_LOCATION)

  const bids = await retrieveBidsFromSubgraph(GRAPH_URL, BIDDER)

  for (const bid of bids) {
    console.log(`> start processing bid with id:${bid.id}`)
    const { validator, pubKeyIndex } = bid
    const { ipfsHashForEncryptedValidatorKey } = validator
    const file = await fetchFromIpfs(ipfsHashForEncryptedValidatorKey)
    const fileParsed = JSON.parse(file)
    const validatorKey = decryptKeyPairJSON(privateKeys, PASSWORD)
    const { pubKeyArray, privKeyArray } = validatorKey
    const keypairForIndex = getKeyPairByPubKeyIndex(pubKeyIndex, privKeyArray, pubKeyArray)
    const data = decryptValidatorKeyInfo(fileParsed, keypairForIndex)
    createFSBidOutput(OUTPUT_LOCATION, data, bid.id)
    console.log(`< end processing bid with id:${bid.id}`)
  }
}

run();
