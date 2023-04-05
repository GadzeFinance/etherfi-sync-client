import { getConfig } from './config.js'

export const fetchFromIpfs = async (cid) => {
    const config = getConfig()
    const url = `${config.IPFS_GATEWAY}/${cid}`
    try {
        const resp = await fetch(url)
        const respJSON = await resp.json()
        return respJSON
    } catch (error) {
        console.error(error)
        return undefined
    }
}