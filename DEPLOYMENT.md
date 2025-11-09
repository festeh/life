# Deployment Guide

## Ionos Server Setup

The application is automatically deployed to the Ionos server via GitHub Actions.

### Prerequisites on Server

1. **Install Required Software**:
```bash
# Update system
apt update && apt upgrade -y

# Install nginx
apt install nginx -y

# Install required tools
apt install curl git -y
```

2. **Create Environment File**:
Create `/opt/life/backend/.env` with the following content:
```bash
PORT=<will-be-set-by-github-actions>
ENV=production
DATABASE_PATH=/opt/life/backend/data/life.db

# Google OAuth - Get from Google Cloud Console
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URL=http://your-domain.com/api/v1/auth/google/callback
ALLOWED_EMAIL=your-email@gmail.com

# JWT Secret - Generate a strong random string
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=24h

# CORS
FRONTEND_URL=http://your-domain.com
```

3. **Set Proper Permissions**:
```bash
chmod 600 /opt/life/backend/.env
chown -R root:root /opt/life
```

### GitHub Secrets

The following secrets are configured in GitHub (already set up):
- `SSH_HOST`: 85.215.131.140
- `SSH_USER`: root
- `SSH_PRIVATE_KEY`: SSH private key for authentication

### Deployment Process

1. Push to `master` branch triggers automatic deployment
2. GitHub Actions builds both backend and frontend
3. Files are copied to `/opt/life/` on the server
4. Backend runs as a systemd service
5. Frontend is served via nginx
6. Backend API is proxied through nginx at `/api`

### Manual Deployment

If needed, you can manually trigger deployment:
```bash
# From GitHub UI: Actions → Deploy to Ionos → Run workflow
```

### Service Management

On the server:
```bash
# Check backend status
systemctl status life-backend

# View backend logs
journalctl -u life-backend -f

# Restart backend
systemctl restart life-backend

# Check nginx status
systemctl status nginx

# Reload nginx
systemctl reload nginx
```

### Access the Application

After deployment, access the application at:
- Frontend: `https://your-subdomain.your-domain.com/`
- Backend API: `https://your-subdomain.your-domain.com/api/v1/`
- Health check: `https://your-subdomain.your-domain.com/api/v1/health`

Note: Backend runs on configured port internally (see .env), and is served via Caddy reverse proxy.

### Database

The SQLite database is located at `/opt/life/backend/data/life.db`

To backup:
```bash
cp /opt/life/backend/data/life.db /opt/life/backup/life-$(date +%Y%m%d).db
```

### Troubleshooting

1. **Backend not starting**:
   - Check logs: `journalctl -u life-backend -n 50`
   - Verify .env file exists and is readable
   - Check database file permissions

2. **Frontend not loading**:
   - Check nginx config: `nginx -t`
   - View nginx logs: `tail -f /var/log/nginx/error.log`

3. **API not accessible**:
   - Verify backend is running: `systemctl status life-backend`
   - Check nginx proxy configuration
   - Verify firewall allows port 80: `ufw status`

### SSL/HTTPS Setup (Optional)

To add SSL certificate:
```bash
# Install certbot
apt install certbot python3-certbot-nginx -y

# Get certificate (replace with your domain)
certbot --nginx -d your-domain.com

# Certificates auto-renew via cron
```

### Monitoring

Consider setting up:
- Log rotation for application logs
- Monitoring service (e.g., uptime checks)
- Backup automation for database
- Rate limiting in nginx for API endpoints
