import { fork } from 'child_process'
import search from './search.js'
import download from './download.js'
import { getSetKey } from '../actions/keys.js'
import { whichDir, upsertDir } from '../actions/directories.js'
import display from '../actions/display.js'
import readline from 'readline'

const index = parseInt(process.argv[2])

// const init = async () => {

  console.log('checking env variables')
  const apiKey = await getSetKey()
  const destination = await whichDir({ username: 'alice' })
  upsertDir(destination)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  console.log('searching')
  search('alice', apiKey)
  .then(async (data) => {
  
    console.log(data, data[index], data.length)
    
    console.log('downloading')
    
    download('alice', data[index], destination)
    .then((file) => {
      console.log('rendering')

      const render = fork(
        new URL('./render.js', import.meta.url).pathname,
        [file]
      )

      process.stdin.on('keypress', (k) => { 
        render.send(k)
      })

      render.on('close', () => {
        console.log('parent exiting on render closed')
        if(index === data.length - 1) {
          process.send({ next: 'EXIT' })
          process.exit(0)
        } else {
          process.send({ next: parseInt(index + 1)})
          process.exit(0)
        }
      })
      
    })
  })  
  .catch((err) => console.log('GOT ERROR', err))
  
// }

// init()

// q listener - abort search/download, kill render, exit
// n listener - abort download/rm file, kill render/rm file, continue
// y listener - kill render, continue
// done, exit

// TODO: try {} catch (e) {}
//       const bobData = await search('bob', await getSetKey())
//       console.log(bobData)

// TODO: fork from main menu, wait for exit, return to menu prompt
