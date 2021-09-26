import inquirer from 'inquirer'
import { config, checkRepeat } from '../actions/utils.js'
import { search } from '../actions/search.js'
import { getDir, openDir, removeDir, checkDirExists } from '../actions/directories.js'
import { mainMenu } from './menus.js'

export default async function historyMenu () {
  if (config().history.length) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'username',
        message: 'select a user',
        choices: config().history
      },
      {
        type: 'list',
        name: 'action',
        message: 'select an action',
        choices: [
          {
            value: 'getStories',
            name: 'get latest stories'
          },
          {
            value: 'getDownloads',
            name: 'view downloaded stories'
          },
          {
            value: 'removeDownloads',
            name: 'remove downloaded stories'
          }
          // (optional): remove from history, add to saved
        ]
      }
    ])

    const username = answers.username

    if (answers.action === 'getStories') {
      await search(username)
    } else if (answers.action === 'getDownloads') {
      const location = await getDir(username)
      if (checkDirExists(location)) {
        openDir(location)
      } else {
        console.log('no downloads found')
      }
    } else if (answers.action === 'removeDownloads') {
      const location = await getDir(username)
      if (checkDirExists(location)) {
        removeDir(location)
      } else {
        console.log('no downloads found')
      }
    }
    await checkRepeat(historyMenu, mainMenu)
  } else {
    console.log('no search history')
    await mainMenu()
  }
}
