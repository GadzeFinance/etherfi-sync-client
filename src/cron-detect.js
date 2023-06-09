import { CronJob } from 'cron'
import { fetchFromIpfs } from './ipfs.js'
import { createFSBidOutput } from './file.js'
import { extractPrivateKeysFromFS, getKeyPairByPubKeyIndex, decryptKeyPairJSON, decryptValidatorKeyInfo } from './decrypt.js'
import { getConfig } from './config.js'
import { retrieveBidsFromSubgraph } from './subgraph.js'

async function run() {

  console.log('=====detecting new validators * start * =====')

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
    const { ipfsHashForEncryptedValidatorKey, validatorPubKey } = validator
    const file = await fetchFromIpfs(ipfsHashForEncryptedValidatorKey)
    const validatorKey = decryptKeyPairJSON(privateKeys, PASSWORD)
    const { pubKeyArray, privKeyArray } = validatorKey
    const keypairForIndex = getKeyPairByPubKeyIndex(pubKeyIndex, privKeyArray, pubKeyArray)
    const data = decryptValidatorKeyInfo(file, keypairForIndex)
    console.log(`creating ${data.keystoreName} for bid:${bid.id}`)
    createFSBidOutput(OUTPUT_LOCATION, data, bid.id, validatorPubKey)
    console.log(`< end processing bid with id:${bid.id}`)
  }

  console.log('=====detecting new validators * end * =====')
}

const detectJob = new CronJob(
    '*/1 * * * *',
    function() {
        run()
    },
    null,
    true,
    'America/Los_Angeles'
)

export default detectJob