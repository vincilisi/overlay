#!/bin/bash
# 🚀 Ultra Performance Streaming Server Setup

echo "🔥 SETUP MEGA PERFORMANCE STREAMING SERVER"
echo "=========================================="

# Aggiorna sistema
sudo apt update && sudo apt upgrade -y

# Installa Node.js 20 (ultra veloce)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installa NGINX con RTMP
sudo apt-get install -y nginx libnginx-mod-rtmp

# Installa Redis per sessioni ultra-veloci
sudo apt-get install -y redis-server

# Installa FFmpeg per encoding video
sudo apt-get install -y ffmpeg

# Configura firewall
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 1935/tcp    # RTMP
sudo ufw allow 3001/tcp    # WebSocket
sudo ufw --force enable

# Ottimizza sistema per streaming
echo 'net.core.rmem_max = 134217728' | sudo tee -a /etc/sysctl.conf
echo 'net.core.wmem_max = 134217728' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv4.tcp_rmem = 4096 87380 134217728' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv4.tcp_wmem = 4096 65536 134217728' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Clona repository
git clone https://github.com/vincilisi/overlay.git /var/www/stardew-stream
cd /var/www/stardew-stream

# Installa dipendenze
npm install --production

# Configura NGINX per RTMP
sudo tee /etc/nginx/nginx.conf > /dev/null <<EOF
worker_processes auto;
rtmp_auto_push on;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

# RTMP Server ultra-performante
rtmp {
    server {
        listen 1935;
        chunk_size 4096;
        allow publish all;
        
        application live {
            live on;
            record off;
            
            # Ultra low latency
            interleave on;
            wait_key on;
            wait_video on;
            
            # Push to Twitch
            push rtmp://live.twitch.tv/live/;
            
            # Push to TikTok (quando disponibile)
            # push rtmp://streaming.tiktok.com/live/;
            
            # WebRTC conversion
            exec ffmpeg -i rtmp://localhost/live/\$name
                -c:v libx264 -preset ultrafast -tune zerolatency
                -c:a aac -b:a 128k -f flv
                rtmp://localhost/hls/\$name;
        }
        
        application hls {
            live on;
            hls on;
            hls_path /var/www/html/hls;
            hls_fragment 1s;
            hls_playlist_length 3s;
        }
    }
}

# HTTP Server
http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    gzip on;
    
    server {
        listen 80;
        server_name _;
        
        location / {
            root /var/www/stardew-stream;
            try_files \$uri \$uri/ /index.html;
        }
        
        # WebSocket proxy
        location /ws {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
        }
        
        # API proxy
        location /api {
            proxy_pass http://localhost:3001;
            proxy_set_header Host \$host;
        }
        
        # HLS streaming
        location /hls {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /var/www/html;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin *;
        }
        
        # Stats
        location /stats {
            rtmp_stat all;
            rtmp_stat_stylesheet stat.xsl;
        }
    }
}
EOF

# Avvia servizi
sudo systemctl restart nginx
sudo systemctl enable nginx
sudo systemctl restart redis
sudo systemctl enable redis

# Crea servizio per app Node.js
sudo tee /etc/systemd/system/stardew-stream.service > /dev/null <<EOF
[Unit]
Description=Stardew Stream Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/stardew-stream
ExecStart=/usr/bin/node auth-server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable stardew-stream
sudo systemctl start stardew-stream

echo ""
echo "🎉 SETUP COMPLETATO!"
echo "==================="
echo "🔴 RTMP Server: rtmp://YOUR_IP:1935/live"
echo "🌐 Web Interface: http://YOUR_IP"
echo "📊 Statistics: http://YOUR_IP/stats"
echo "🎥 Stream URL: http://YOUR_IP/hls/STREAM_KEY.m3u8"
echo ""
echo "🚀 Server pronto per streaming MEGA PERFORMANCE!"

# Test di performance
echo "🧪 Test Performance..."
ab -n 1000 -c 10 http://localhost/ > /tmp/performance-test.txt
echo "📊 Risultati test salvati in /tmp/performance-test.txt"