module.exports = {
  apps: [
    {
      name: 'ZeUSD_Beta',
      port: '3001',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
