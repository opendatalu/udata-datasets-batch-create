import fs from 'fs'
import {  deleteDataset } from './odp.js'
import dotenv from 'dotenv'

/*
 Usage: node.js cleanup.js <file>
 The file should contain one dataset id per line, with an optional comment after a semicolon. Example:
 655cae2512abf01f541bda7d ; this is a comment

*/


dotenv.config()

const [,, filename] = process.argv
if (!filename) {
  console.error('Usage: node cleanup.js <file>')
  process.exit(1)
}

const content = fs.readFileSync(filename, 'utf8')
const lines = content.split(/\r?\n/).filter(line => line.length > 0).map(line => line.split(';')[0]).map(line => line.trim())


lines.forEach(e => {
    deleteDataset(e).then(a => { console.log('Dataset deletion', (a) ? 'succeeded' : 'failed', 'for', e) })
})
