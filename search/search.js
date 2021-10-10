/*
import readline from 'readline'
import fs from 'fs'
import { stdout } from 'process'
import { spawn } from 'child_process'
import inquirer from 'inquirer'
import { whichDir, upsertDir, rmDir } from '../actions/directories.js'
import { getSetKey } from '../actions/keys.js'
import keyboard from '../actions/keyboard.js'
import display from '../actions/display.js'
import utils from '../actions/utils.js'

const { rows, columns } = stdout

function sigintExit () {
  display.term.reset()
  display.txt.center('SIGINT exit')
  process.exit(0)
}
*/

import https from 'https'


// ---- get search results
export default function search (username, apiKey) {
  // ---- promisify
  return new Promise((resolve, reject) => {
    // ---- body
    const query = new URL('/clients/api/ig/ig_profile', 'https://instagram-bulk-profile-scrapper.p.rapidapi.com')
    query.searchParams.set('ig', username)
    query.searchParams.set('response_type', 'story')

    // ---- request
    const req = https.request(query.href)

    // ---- headers
    req.setHeader('x-rapidapi-host', 'instagram-bulk-profile-scrapper.p.rapidapi.com')
    req.setHeader('x-rapidapi-key', apiKey)

    // ---- handle response
    req.on('response', function (res) {

      // ---- capture response
      let dataStr = ''
      res.on('data', function (chunk) {
        dataStr += chunk.toString('utf8')
      })

      res.on('end', function () {
        const allMedia = JSON.parse(dataStr, 0, 2)
        
        // ---- if we received a valid response, format it
        if (allMedia[0]?.story?.data?.length) {
          const files = allMedia[0].story.data.map(function (item) {
            let formatted = {}
            // ---- is image
            if (item.media_type === 1) {
              formatted = {
                url: item.image_versions2.candidates[0].url,
                type: 'jpg',
                display: 'image'
              }
            }
            // ---- is video
            else if (item.media_type === 2) {
              formatted = {
                url: item.video_versions[0].url,
                type: 'mp4',
                display: 'video'
              }
            }
            return formatted
          })
          // ---- done
          resolve(files)  
        }

        // ---- exit if we didn't receive anything usable
        else {
          // ---- done
          reject()
        }
      })
    })

    req.end()
  })
}






/*


// ----
function getOne (destination, opts) {
  if (opts.int === opts.max) {
    console.log('done')
    // display.txt.center('done')
    display.cursor.show()
    process.exit(0)
  }
  // TODO: abort req (?)
  display.cursor.hide()
  keyboard.reload()
  keyboard.sigintListener(() => {
    console.log('GET 1')
    console.log(`lYOU DIED ON ${opts.int + 1} of ${opts.max}`)
    process.exit(0)
    // rendered.stdout.unpipe(stdout)
  })
  console.log(`loading preview ${opts.int + 1} of ${opts.max}`)
  // display.txt.center(`loading preview ${opts.int + 1} of ${opts.max}`)

  const current = opts.data[opts.int]
  const fileName = utils.makeName(opts.username, current.type)
  const filePath = new URL(`${destination}/${fileName}`, import.meta.url).pathname
  const stream = fs.createWriteStream(filePath)
  const req = https.request(current.url)

  req.on('response', (res) => {
    stdout.write('\n')
    display.progress(res)
    res.pipe(stream)
    // TODO: ANOTHER SIGINT LISTENER TO UNPIPE THIS TOO??

    res.on('end', () => {
      showOne(destination, filePath, opts)
    })
  })
  
  req.end()
}



// ----
function showOne (destination, filePath, opts) {
  display.cursor.hide()
  keyboard.reload()
  display.txt.center('y: keep, n: skip, q: quit')
  // keyboard.sigintListener(() => display.term.reset())

  const rendered = spawn(
    new URL('../vendor/timg', import.meta.url).pathname,
    [
      `-g ${columns}x${rows - 4}`,
      '--center',
      filePath
    ]
  )
  rendered.stdout.pipe(stdout)

  keyboard.sigintListener(() => {
    rendered.stdout.unpipe(stdout)
    console.log('YOU DID ITY frum daddy YOU DID IT. thnx1')
    process.exit(0)
  })
  
  let signal = ''
  keyboard.keyListener({
    y: () => {
      signal = 'save'
      rendered.kill()
    },
    n: () => {
      signal = 'skip'
      fs.rmSync(filePath)
      rendered.kill()
    }
  })

  rendered.on('close', () => {
    display.cursor.hide()
    
    function getNext () {
      process.removeAllListeners('SIGINT')
      getOne(destination, {
        ...opts,
        int: opts.int + 1
      })
    }
    
    if (signal === 'skip' || signal === 'save') {
      getNext()
    } else {
      keyboard.reload()
      keyboard.sigintListener(() => {
          rendered.stdout.unpipe(stdout)
          console.log('YOU DID ITY AGAIN IN HELL DADDU')
              process.exit(0)

      })

      keyboard.keyListener({
        y: () => getNext(),
        n: () => {
          fs.rmSync(filePath)
          getNext()
        }
      })
    }
  })
}

// ----
async function init () {
  const apiKey = await getSetKey()

  const username = (await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'type a username to search'
    }
  ])).username

  const getDestination = async () => {
    const dir = await whichDir({ username })
    upsertDir(dir)
    readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    return dir
  }

  const destination = await getDestination()
  getAll(username, apiKey, destination)
}

init()
export default init

*/
