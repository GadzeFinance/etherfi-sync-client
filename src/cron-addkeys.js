import { CronJob } from 'cron'
import { getConfig } from './config.js'

async function run() {

  console.log('=====moving keys to prysm * start * =====')

  const {
    GRAPH_URL,
    BIDDER,
    PRIVATE_KEYS_FILE_LOCATION,
    OUTPUT_LOCATION,
    PASSWORD,
  } = getConfig()

  const processedBidIds = ['0x2e'] // TODO move to sqlitedb OR other app with sqlitedb as well
  let newBids = ['0x2f']
  console.log(`skipping bids where ids: ${processedBidIds.join(',')}`)
  console.log(`detected new bids where ids: ${newBids.join(',')}`)

  console.log('=====moving keys to prysm * end * =====')
}

const addkeysJob = new CronJob(
    '*/2 * * * *',
    function() {
        // run()
        // TODO the above run should monitor what has been added before
        // & run the bash scripts for new validators automatically
    },
    null,
    true,
    'America/Los_Angeles'
)

export default addkeysJob