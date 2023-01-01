https://medium.com/@berman82312/how-to-setup-cloudflare-stream-direct-creator-uploads-correctly-802c37cbfd0e

curl -X POST -F "file=@form.jpg" https://reportbase.com/images 

curl --request POST \
 --url https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v2/direct_upload \
 --header 'Authorization: Bearer <API_TOKEN>' \
 --form 'requireSignedURLs=true' \
 --form 'metadata={"key":"value"}'

{
  "result": {
    "id": "2cdc28f0-017a-49c4-9ed7-87056c83901",
    "uploadURL": "https://upload.imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901"
  },
  "result_info": null,
  "success": true,
  "errors": [],
  "messages": []
}

curl  --url https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1/<IMAGE_ID> \
 --header 'Content-Type: application/json' \
 --header 'Authorization: Bearer <API_TOKEN>'

{
  "result": {
    "id": "2cdc28f0-017a-49c4-9ed7-87056c83901",
    "metadata": {
      "key": "value":
    },
    "uploaded": "2022-01-31T16:39:28.458Z",
    "requireSignedURLs": true,
    "variants": [
      "https://imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901/public",
      "https://imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901/thumbnail"
    ],
    "draft": true
  },
  "success": true,
  "errors": [],
  "messages": []
}


