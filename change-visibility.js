import * as dotenv from 'dotenv'
import process from 'node:process'
import * as odp from './odp.js'

async function main () {
  dotenv.config()

  const id = process.argv[2].trim()
  const isPrivate = (process.argv[3].toLowerCase() !== 'false')

  const res = await odp.updateDataset(id, {private: isPrivate })
  if (isPrivate === res.private) {
    console.log(id, ': private state successfully changed to', isPrivate)
  } else {
    console.log(id, ': unable to change private state')
  }
}
main().then(() => { }).catch(e => { console.error(e); process.exitCode = 1 })
