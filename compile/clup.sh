for ((i=0;i<120;i++)); do

    IMAGE=$(printf "url=BOAT.%04d.webp" "$i")
    echo $IMAGE
    ID=$(printf "id=BOAT.%04d" "$i")
    ACCOUNT=$(printf "https://api.cloudflare.com/client/v4/accounts/%s/images/v1" "41f6f507a22c7eec431dbc5e9670c73d")
    BEARER=$(printf "Authorization: Bearer %s" "y0wMwbTTYZkJG9IDm3EngHYrnsdEqfaUPgc6J38R")
    curl --request POST $ACCOUNT  --header "$BEARER" --form $IMAGE --form $ID

done

./iwh.sh > out
























