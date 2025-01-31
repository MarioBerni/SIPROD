# Guía de Configuración del Servidor SIPROD
> Última actualización: 31 de Enero 2025

## Índice
1. [Especificaciones](#especificaciones)
2. [Configuraciones](#configuraciones)
3. [Despliegue](#despliegue)
4. [Monitoreo](#monitoreo)
5. [Acceso](#acceso)

## Especificaciones

### Instancia Actual
| Característica | Detalle |
|---------------|---------|
| IP Pública | 179.27.203.208 |
| SO | Ubuntu Jammy 22.04 LTS |
| CPU | 2 vCores @ 3.35 GHz |
| RAM | 4 GB |
| SSD | 50 GB |
| Transferencia | 100 GB/mes |
| Backups | 5 copias |

## Configuraciones

### Sistema Base
```bash
# Actualización del sistema
sudo apt update && sudo apt upgrade -y
sudo reboot

# Verificar kernel
uname -r  # 5.15.0-130-generic
```

### Firewall (UFW)
```bash
# Instalación y configuración
sudo apt install ufw -y
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # Frontend
sudo ufw allow 4000  # API
sudo ufw enable
```

### Seguridad: Fail2Ban y SSH

#### Fail2Ban
```bash
sudo apt install fail2ban -y
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

Configuración en `/etc/fail2ban/jail.local`:
```ini
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600
findtime = 600
```

#### SSH Hardening
En `/etc/ssh/sshd_config`:
```bash
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
```

### Nginx
```bash
# Instalación
sudo apt install nginx -y

# Configuración proxy inverso
server {
    listen 80;
    server_name siprod.uy www.siprod.uy;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### SSL/TLS
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d siprod.uy -d www.siprod.uy
```

### Node.js y Dependencias
```bash
# Instalación Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalación pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### PostgreSQL
```bash
# Instalación
sudo apt install postgresql postgresql-contrib -y

# Configuración
sudo -u postgres createdb siprod
sudo -u postgres createuser siprod_user

# Acceso remoto en pg_hba.conf
host    siprod    siprod_user    0.0.0.0/0    md5
```

## Despliegue

### Frontend (Next.js)
```bash
cd /var/www/siprod/apps/web
pnpm install
pnpm build
pnpm start
```

### Backend (Express)
```bash
cd /var/www/siprod/apps/api
pnpm install
pnpm build
pnpm start
```

### Servicios PM2
```bash
npm install -g pm2
pm2 start npm --name "frontend" -- start
pm2 start npm --name "backend" -- start
pm2 startup
pm2 save
```

## Monitoreo

### Logs
- Nginx: `/var/log/nginx/`
- PM2: `~/.pm2/logs/`
- Sistema: `/var/log/syslog`

### Comandos Útiles
```bash
# Estado de servicios
systemctl status nginx
systemctl status postgresql
pm2 status

# Monitoreo de recursos
htop
df -h
free -m
```

## Acceso

### SSH
```bash
ssh usuario@179.27.203.208 -i ~/.ssh/siprod_key
```

### Base de Datos
```bash
psql -h localhost -U siprod_user -d siprod
```

### Backups
```bash
# Base de datos
pg_dump -U siprod_user siprod > /backup/siprod_$(date +%Y%m%d).sql

# Archivos
rsync -av /var/www/siprod /backup/
```

---
Para más detalles sobre configuraciones específicas, consultar la documentación completa en el repositorio.