module.exports = {
  apps: [{
      name: "app1",
      script: "./src/server.js -i max",
      watch: true,
      autorestart: true,
      args: '--puerto=3001 --runMode=CLUSTER',
    },
    {
      name: "app2",
      script: "./src/server.js -i max",
      watch: true,
      autorestart: true,
      args: '--puerto=3002 --runMode=CLUSTER',
    },
    {
      watch: ['./src/server.js'],
      script: './src/server.js'
    }
  ]
};