for ((i=0;i<52;i++)); do

#    IMAGE=$(printf "url=https://reportbase.us/compile/HOPET.%04d.webp" "$i")
#    IMAGE=$(printf "file=@./DASHA.%04d.jpg" "$i")

    IMAGE=$(printf "url=scott@207.246.108.73:/srv/http/reportbase.com/compile/DOOM.%04d.webp" "$i")
    ID=$(printf "id=DOOM.%04d" "$i")
    POST=$(printf "https://api.cloudflare.com/client/v4/accounts/%s/images/v1" "41f6f507a22c7eec431dbc5e9670c73d")
    HEADER=$(printf "Authorization: Bearer %s" "y0wMwbTTYZkJG9IDm3EngHYrnsdEqfaUPgc6J38R")
    curl --request POST $POST  --header "$HEADER" --form $IMAGE --form $ID --form 'metadata={"key":"value"}'

done

























