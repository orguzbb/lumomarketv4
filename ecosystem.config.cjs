module.exports = {
  apps: [
    {
      name: 'lumomarketv4',
      cwd: './backend',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 5004
      }
    }
  ]
};