import dotenv from 'dotenv'
import { fetchThrottle } from './utils.js'

dotenv.config()

const odpURL = process.env.odpURL
const odpAPIKey = process.env.odpAPIKey

async function createDatasetFromJSON (dataset) {
  if (dataset != null) {
    try {
      const res = await fetchThrottle(odpURL + '/datasets/', {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8',
          'X-API-KEY': odpAPIKey
        },
        body: JSON.stringify(dataset),
        method: 'POST'
      })

      if (!res.ok) {
        res.text().then(t => { throw t })
      }
      return res.json()
    } catch (e) {
      console.error(e)
      return {}
    }
  } else {
    console.error('cannot create empty dataset')
  }
}

export { createDatasetFromJSON }
