#!/usr/bin/env bash
# One-time setup of the Novel Tissues website on a fresh Ubuntu/Debian VPS (e.g. Hostinger VPS).
# Run as root in the VPS terminal:
#   curl -fsSL https://raw.githubusercontent.com/AllamaPrabhuad/novel-refer-backend/claude/b2b-baby-care-website-vmwutq/site/vps-setup.sh | bash
#
# It installs nginx + PHP, serves the `hostinger-site` branch, issues a free SSL certificate once the
# domain points at this server, and pulls new versions from GitHub every 5 minutes.
set -euo pipefail

DOMAIN="${DOMAIN:-babywipesmanufacturer.com}"
EMAIL="${EMAIL:-sales@noveltissues.com}"          # for SSL expiry notices
REPO="https://github.com/AllamaPrabhuad/novel-refer-backend.git"
BRANCH="hostinger-site"
SITE_DIR="/var/www/$DOMAIN"
WEBROOT="$SITE_DIR/public_html"

say() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }

[ "$(id -u)" -eq 0 ] || { echo "Please run as root."; exit 1; }
command -v apt-get >/dev/null || { echo "This script needs Ubuntu or Debian."; exit 1; }

if ss -ltnp 2>/dev/null | grep -E ':80\s' | grep -vq nginx; then
  echo "Something other than nginx already uses port 80 on this server:"
  ss -ltnp | grep -E ':80\s'
  echo "Stop it first (or use a fresh VPS), then run this script again."
  exit 1
fi

say "Installing nginx, PHP, git and certbot"
export DEBIAN_FRONTEND=noninteractive
echo "postfix postfix/main_mailer_type select Internet Site" | debconf-set-selections
echo "postfix postfix/mailname string $DOMAIN" | debconf-set-selections
apt-get update -qq
apt-get install -y -qq nginx php-fpm php-cli git certbot python3-certbot-nginx postfix cron curl >/dev/null
postconf -e "inet_interfaces = loopback-only" "myhostname = $DOMAIN" && systemctl restart postfix || true

say "Downloading the website from GitHub ($BRANCH)"
mkdir -p "$SITE_DIR"
if [ -d "$WEBROOT/.git" ]; then
  git -C "$WEBROOT" fetch -q --depth 1 origin "$BRANCH"
  git -C "$WEBROOT" reset -q --hard "origin/$BRANCH"
else
  rm -rf "$WEBROOT"
  git clone -q --depth 1 -b "$BRANCH" "$REPO" "$WEBROOT"
fi
chown www-data:www-data "$SITE_DIR"   # PHP keeps the leads backup CSV here, outside the web root

PHP_SOCK=$(ls /run/php/php*-fpm.sock 2>/dev/null | head -1)
[ -n "$PHP_SOCK" ] || { systemctl restart "$(systemctl list-unit-files 'php*-fpm.service' --no-legend | awk '{print $1}' | head -1)"; PHP_SOCK=$(ls /run/php/php*-fpm.sock | head -1); }

say "Configuring nginx for $DOMAIN"
L6=""; L6D=""
if [ -s /proc/net/if_inet6 ]; then L6="listen [::]:80;"; L6D="listen [::]:80 default_server;"; fi
cat > "/etc/nginx/sites-available/$DOMAIN" <<NGINX
server {
    listen 80;
    $L6
    server_name www.$DOMAIN;
    return 301 \$scheme://$DOMAIN\$request_uri;
}

server {
    listen 80 default_server;
    $L6D
    server_name $DOMAIN;
    root $WEBROOT;
    index index.html index.php;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~ \.php\$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:$PHP_SOCK;
    }

    location ~ /\.(git|ht) { deny all; }
    location = /api/lib.php { deny all; }

    location ~* \.(css|js)\$ { expires 7d; }
    location ~* \.(png|pdf)\$ { expires 30d; }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml application/xml text/plain;
}
NGINX
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
rm -f /etc/nginx/sites-enabled/default
nginx -t -q
systemctl enable -q --now nginx
systemctl reload nginx

say "Installing the novel-setup command (email + leads dashboard settings)"
cat > /usr/local/bin/novel-setup <<'SETUP'
#!/usr/bin/env bash
# Writes the server-only settings for lead emails and the /admin/ leads dashboard.
set -euo pipefail
CONFIG="__SITE_DIR__/novel-config.php"
echo "Lead emails are sent through a mailbox so they reach the inbox, not spam."
read -rp "Mailbox that sends the emails (e.g. sales@__DOMAIN__): " SMTP_USER
read -rsp "Password of that mailbox: " SMTP_PASS; echo
read -rp "SMTP server [smtp.hostinger.com]: " SMTP_HOST; SMTP_HOST=${SMTP_HOST:-smtp.hostinger.com}
read -rp "SMTP port [465]: " SMTP_PORT; SMTP_PORT=${SMTP_PORT:-465}
read -rp "Where should lead notifications go [__LEAD__]: " LEAD; LEAD=${LEAD:-__LEAD__}
read -rp "Google Sheet web-app URL (optional, Enter to skip): " HOOK
read -rsp "Choose a password for the leads dashboard (/admin/): " ADMIN; echo
SMTP_USER="$SMTP_USER" SMTP_PASS="$SMTP_PASS" SMTP_HOST="$SMTP_HOST" SMTP_PORT="$SMTP_PORT" LEAD="$LEAD" HOOK="$HOOK" ADMIN="$ADMIN" \
php -r '$c = ["lead_email" => getenv("LEAD"), "smtp" => ["host" => getenv("SMTP_HOST"), "port" => (int) getenv("SMTP_PORT"), "user" => getenv("SMTP_USER"), "pass" => getenv("SMTP_PASS"), "from" => getenv("SMTP_USER")], "admin_password_hash" => password_hash(getenv("ADMIN"), PASSWORD_DEFAULT), "sheet_webhook" => getenv("HOOK"), "auto_reply" => true]; echo "<?php\nreturn " . var_export($c, true) . ";\n";' > "$CONFIG"
chown root:www-data "$CONFIG"; chmod 640 "$CONFIG"
echo "Saved. Leads dashboard: https://__DOMAIN__/admin/"
SETUP
sed -i "s#__SITE_DIR__#$SITE_DIR#g; s#__DOMAIN__#$DOMAIN#g; s#__LEAD__#$EMAIL#g" /usr/local/bin/novel-setup
chmod 755 /usr/local/bin/novel-setup

say "Scheduling automatic updates and SSL"
cat > /etc/cron.d/novel-tissues <<CRON
# Pull the latest website from GitHub every 5 minutes
*/5 * * * * root git -C $WEBROOT fetch -q --depth 1 origin $BRANCH && git -C $WEBROOT reset -q --hard origin/$BRANCH
# Issue the SSL certificate as soon as $DOMAIN points at this server
*/15 * * * * root test -d /etc/letsencrypt/live/$DOMAIN || certbot --nginx -n --agree-tos -m $EMAIL --redirect -d $DOMAIN -d www.$DOMAIN -q
CRON
chmod 644 /etc/cron.d/novel-tissues
systemctl enable -q --now cron 2>/dev/null || systemctl enable -q --now crond 2>/dev/null || true

SERVER_IP=$(curl -fsS4 --max-time 10 https://api.ipify.org || hostname -I | awk '{print $1}')
DNS_IP=$(getent ahostsv4 "$DOMAIN" | awk 'NR==1{print $1}' || true)

if [ "$DNS_IP" = "$SERVER_IP" ]; then
  say "Issuing the SSL certificate"
  certbot --nginx -n --agree-tos -m "$EMAIL" --redirect -d "$DOMAIN" -d "www.$DOMAIN" || echo "SSL will be retried automatically every 15 minutes."
  say "Done — https://$DOMAIN is live."
  echo "Next: run  novel-setup  to connect lead emails and set the leads dashboard password."
else
  say "Website installed. One step left:"
  echo "Point the domain at this server in hPanel → Domains → $DOMAIN → DNS records:"
  echo "   A    @     $SERVER_IP"
  echo "   A    www   $SERVER_IP"
  echo "(currently $DOMAIN points to: ${DNS_IP:-nothing})"
  echo "SSL is issued automatically within 15 minutes after the DNS change takes effect."
  echo "Until then you can preview the site at: http://$SERVER_IP"
  echo "Then run  novel-setup  to connect lead emails and set the leads dashboard password."
fi
