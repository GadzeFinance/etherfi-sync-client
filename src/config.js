export const getConfig = () => {

    const IPFS_GATEWAY = process.env.ETHERFI_SC_IPFS_GATEWAY
    const GRAPH_URL = process.env.ETHERFI_SC_GRAPH_URL
    const BIDDER = process.env.ETHERFI_SC_BIDDER
    const PRIVATE_KEYS_FILE_LOCATION = process.env.ETHERFI_SC_PRIVATE_KEYS_FILE_LOCATION
    const OUTPUT_LOCATION = process.env.ETHERFI_SC_OUTPUT_LOCATION
    const PASSWORD = process.env.ETHERFI_SC_PASSWORD

    const env = {
        GRAPH_URL,
        BIDDER,
        PRIVATE_KEYS_FILE_LOCATION,
        OUTPUT_LOCATION,
        PASSWORD,
        IPFS_GATEWAY,
    }

    const valuesAsArray = Object.values(env)

    console.log(valuesAsArray)

    if (!valuesAsArray.every(x => typeof x === 'string')) {
        throw Error('env did not load correctly, stopping')
    }

    return env
}