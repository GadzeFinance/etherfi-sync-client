import { request, gql } from "graphql-request"

export const retrieveBidsFromSubgraph = async (GRAPH_URL, BIDDER) => {

    const bidsQuery = gql`
    {
      bids(where: { bidderAddress: "${BIDDER}", status: "WON", validator_not: null }) {
        id
        bidderAddress
        pubKeyIndex
        validator {
            id
            phase
            ipfsHashForEncryptedValidatorKey
            validatorPubKey
        }
      }
    }
    `

    let bids = []
    try {
        const { bids: result } = await request(GRAPH_URL, bidsQuery)
        bids = result
    } catch (error) {
        console.error('an error occurred querying bids')
    }
    return bids
}