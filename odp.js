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

async function updateDataset (id, payload) {
  try {
    const res = await fetchThrottle(odpURL + '/datasets/' + id + '/', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': odpAPIKey
      },
      body: JSON.stringify(payload),
      method: 'PUT'
    })
    if (!res.ok) {
      res.text().then(t => { throw t })
    }
    return res.json()
  } catch (e) {
    console.error(e)
    return {}
  }
}

async function deleteDataset (id) {
  try {
    const params = {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': odpAPIKey
      },
      method: 'DELETE'
    }
    const res = await fetchThrottle(odpURL + '/datasets/' + id + '/', params)

    return (res.ok)
  } catch (e) {
    console.error(e)
    return false
  }
}


export { createDatasetFromJSON, updateDataset, deleteDataset }
