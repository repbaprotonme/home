#sudo systemctl restart nginx

server 
{
      server_name reportbase.com;

      location /
      {
	   expires -1;
           root /srv/http/reportbase.com;
           index  index.html index.htm;
      }

      location /data/
      {
	   expires 24h;
           root /srv/http/reportbase.com;
      }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/reportbase.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/reportbase.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server 
{
    if ($host = reportbase.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


      listen 80;
      server_name reportbase.com;
    return 404; # managed by Certbot


}
