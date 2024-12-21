#!/bin/bash

# Variables
NEW_USER="siprod_admin"
SSH_PORT=2222  # Puerto SSH personalizado

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Verificar si se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Este script debe ejecutarse como root${NC}"
    exit 1
fi

# 1. Actualización inicial del sistema
print_message "Actualizando el sistema..."
apt update && apt upgrade -y

# 2. Instalar herramientas básicas
print_message "Instalando herramientas básicas..."
apt install -y curl wget git ufw fail2ban unattended-upgrades

# 3. Configurar zona horaria
print_message "Configurando zona horaria..."
timedatectl set-timezone America/Montevideo

# 4. Crear usuario no-root
print_message "Creando usuario $NEW_USER..."
useradd -m -s /bin/bash $NEW_USER
usermod -aG sudo $NEW_USER

# 5. Configurar SSH
print_message "Configurando SSH..."
# Backup del archivo original
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# Configurar SSH
cat > /etc/ssh/sshd_config << EOF
Port $SSH_PORT
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers $NEW_USER
EOF

# 6. Configurar UFW
print_message "Configurando firewall (UFW)..."
ufw default deny incoming
ufw default allow outgoing
ufw allow $SSH_PORT/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# 7. Configurar fail2ban
print_message "Configurando fail2ban..."
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
systemctl enable fail2ban
systemctl start fail2ban

# 8. Configurar actualizaciones automáticas
print_message "Configurando actualizaciones automáticas..."
dpkg-reconfigure -plow unattended-upgrades

# 9. Instalar Docker
print_message "Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $NEW_USER

# 10. Instalar Docker Compose
print_message "Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 11. Habilitar ESM
print_message "Habilitando ESM..."
pro enable esm-infra

print_message "¡Configuración inicial completada!"
print_message "Por favor, establece una contraseña para $NEW_USER ejecutando: passwd $NEW_USER"
print_message "No olvides activar UFW ejecutando: ufw enable"
print_message "Reinicia el servidor para aplicar todos los cambios"
