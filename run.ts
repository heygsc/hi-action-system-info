import { getFeedbackSystemInfo } from './index.js'

const main = async () => {
  const info = await getFeedbackSystemInfo()
  console.log(JSON.stringify(info, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
