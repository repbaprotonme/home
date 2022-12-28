export default {
  async fetch(request) {

    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    switch (request.method) {
      case 'PUT':
        return new Response(`"""PUT!`);

      case 'GET':
            const { searchParams, href, search } = new URL(request.url)
            var j = request.url.split("/")
            let id = j[j.length-2]
            let options = j[j.length-1]
            let k = 'https://imagedelivery.net/w9Lvwo1EAmYzHfbI5TkJ7g/'+id+'/'+options
            return fetch(k);

      case 'DELETE':
//curl --request DELETE \
//--url https://api.cloudflare.com/client/v4/accounts/41f6f507a22c7eec431dbc5e9670c73d/images/v1/cbe96e39-8046-48ad-796f-fe2159fe4f00 \
//-H "Authorization: Bearer majjgSB2awSS1-8WJ7OoRvst4gsGjfLl3Fl0kpdC" -H 'Content-Type: application/json'

        return new Response(`"""DELETE!`);

      default:
        return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'PUT, GET, DELETE, PATCH', }, });
    }

  },
};

/*

#update image
curl --request PATCH --url https://api.cloudflare.com/client/v4/accounts/41f6f507a22c7eec431dbc5e9670c73d/images/v1/HOME.0000 --header 'Content-Type: application/json' --header "Authorization: Bearer majjgSB2awSS1-8WJ7OoRvst4gsGjfLl3Fl0kpdC" --data '{"metadata": 100, "requireSignedURLs": false }

{
  "result": {
    "id": "HOME.0000",
    "filename": "HOME.0000.jpg",
    "meta": 100,
    "uploaded": "2022-12-15T19:17:00.597Z",
    "requireSignedURLs": false,
    "variants": [
      "https://imagedelivery.net/w9Lvwo1EAmYzHfbI5TkJ7g/HOME.0000/main"
    ]
  },
  "success": true,
  "errors": [],
  "messages": []
}

#get base image
curl --request GET \
    --url https://api.cloudflare.com/client/v4/accounts/41f6f507a22c7eec431dbc5e9670c73d/images/v1/HOME.0000/blob \
    -H "Authorization: Bearer majjgSB2awSS1-8WJ7OoRvst4gsGjfLl3Fl0kpdC" --header 'Content-Type: application/json' --output HOME.0000.webp
*/

