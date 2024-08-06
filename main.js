import * as dotenv from 'dotenv'
import process from 'node:process'
import * as XLSX from 'xlsx/xlsx.mjs'
import * as fs from 'fs'
import * as odp from './odp.js'
import { log } from './utils.js'

XLSX.set_fs(fs)

const frequencies = ['unknown', 'punctual', 'continuous', 'hourly', 'fourTimesADay', 'threeTimesADay', 'semidaily', 'daily', 'fourTimesAWeek', 'threeTimesAWeek', 'semiweekly', 'weekly', 'biweekly', 'threeTimesAMonth', 'semimonthly', 'monthly', 'bimonthly', 'quarterly', 'threeTimesAYear', 'semiannual', 'annual', 'biennial', 'triennial', 'quinquennial', 'irregular']
const licenses = ['notspecified', 'odc-odbl', 'odc-pddl', 'odc-by', 'cc-zero', 'cc-by', 'cc-by-sa', 'other-open', 'other-pd', 'other-at']

function getFieldVal (sheet, x, y, type) {
  if (sheet[x + y] !== undefined) {
    return sheet[x + y][type]
  } else {
    return ''
  }
}

function getLines (sheet) {
  const col = 'A'
  const start = 2
  const lines = Object.keys(sheet).filter(e => { return e[0] === col }).map(e => parseInt(e.substring(1))).filter(e => e >= start).map(e => e.toString())
  return lines
}

function toODPDataset (line) {
  const data = {
    description: line[1],
    license: line[4],
    organization: { id: process.env.odpOrgId },
    tags: formatTags(line[2]),
    title: line[0],
    frequency: line[3],
    spatial: {
      geom: null,
      granularity: 'country',
      zones: [
        'country:lu'
      ]
    }
  }
  if (process.env.private === 'true') {
    data.private = true
  }

  return data
}

function formatTags (tags) {
  tags = tags.split(';').map(e => e.trim())
  tags = tags.map(t => { return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '') }) // remove accents
  tags = tags.map(t => { return t.replace(/^[a-zA-Z]+'/, '') }) // remove articles with apostrophe
  tags = tags.map(t => { return t.replace(/[.']/g, '') }) // remove special characters because udata removes them and we need to be able to compare
  tags = tags.map(t => { return t.replace(/[/()]+/g, '-') }) // udata replaces thoses characters with dashes
  tags = tags.map(t => { return t.replace(/&/g, '-and-') })
  tags = tags.map(t => { return t.replace(/--+/g, '-') }) // remove multiple dashes
  tags = [...new Set(tags)] // remove duplicates
  tags = tags.filter(t => { return (t.length >= 3 && t.length <= 96) })
  return tags
}

async function main () {
  dotenv.config()

  log((new Date()).toLocaleString(), 'Dataset creation starts...')

  // read excel file
  const workbook = XLSX.readFile('datasets.xlsx')
  const sheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]]
  const lines = getLines(sheet)
  // name, description, keywords, frequency, license
  const columns = ['A', 'B', 'C', 'D', 'E']

  const datasets = lines.map(line => {
    return columns.map(col => {
      return getFieldVal(sheet, col, line, 'v').trim()
    })
  })

  console.log('datasets to create:', datasets.length)

  // data cleanup
  datasets.forEach(d => {
    d[3] = (d[3] === '') ? 'unknown' : d[3]
    d[4] = (d[4] === '') ? 'notspecified' : d[4]
    if (process.env.extraDesc !== undefined) {
      d[1] = d[1] + '\n' + process.env.extraDesc
    }
    if (process.env.extraTags !== undefined) {
      d[2] = d[2] + ((d[2] === '') ? '' : ';') + process.env.extraTags
    }
  })

  // sanity checks
  datasets.forEach(d => {
    if (!frequencies.includes(d[3])) {
      console.error('Frequency not recognized: ', d[3])
      process.exit(1)
    }
    if (!licenses.includes(d[4])) {
      console.error('License not recognized: ', d[4])
      process.exit(1)
    }
  })

  // create datasets
  for await (let d of datasets) {
    const result = await odp.createDatasetFromJSON(toODPDataset(d))
    console.log(result.id, ';', d[0])
  }
}
main().then(() => { log((new Date()).toLocaleString(), 'Sync successful') }).catch(e => { console.error(e); process.exitCode = 1 })
