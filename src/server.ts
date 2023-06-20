import 'module-alias/register'
import 'source-map-support/register'

import runApp from '@/stuf/runApp'
import runMongo from '@/stuf/mongo'

void (async () => {
  console.log('Starting mongo')
  await runMongo()
  console.log('Mongo connected')
  await runApp()
})()
