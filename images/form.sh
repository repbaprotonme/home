#https://walshy.dev/blog/21_09_10-handling-file-uploads-with-cloudflare-workers

$ curl -X POST -F 'file=@/home/user/images/example.png' https://worker-name.example.workers.dev
{"name":"example.png","type":"image/png","size":30283,"hash":"17946ec18d7b80f31e545acbc8baeb6294e39adc"}
























