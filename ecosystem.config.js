module.exports = {
  apps: [
    {
      name: 'iqx',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3031
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3031
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      // Ensure the app is built before starting
      pre_deploy_local: 'npm run build',
      post_deploy: 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  ]
};
