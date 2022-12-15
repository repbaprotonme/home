for ((i=0;i<104;i++)); do

    IMAGE=$(printf "url=https://reportbase.com/compile/HOME.%04d.jpg" "$i")
    ID=$(printf "id=HOME.%04d" "$i")
    ACCOUNT=$(printf "https://api.cloudflare.com/client/v4/accounts/%s/images/v1" "41f6f507a22c7eec431dbc5e9670c73d")
    BEARER=$(printf "Authorization: Bearer %s" "c4UYxk8I0EWCA16enS0IK8KYaE8p2J8gI6GnraoH")
    curl --request POST $ACCOUNT  --header "$BEARER" --form $IMAGE --form $ID

done


./iwh.sh > out
























