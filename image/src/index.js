export default {
  async fetch(request) {

    switch (request.method) {
      case 'PUT':
      {
            return new Response(`"""PUT!`);
      }
      case 'GET':
      {
            const { searchParams, href, search } = new URL(request.url)
            var j = request.url.split("/")
            let id = j[j.length-2]
            let options = j[j.length-1]
            let k = 'https://imagedelivery.net/w9Lvwo1EAmYzHfbI5TkJ7g/'+id+'/'+options
            return fetch(k);
      }
      case 'DELETE':
      {
            const options =
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer majjgSB2awSS1-8WJ7OoRvst4gsGjfLl3Fl0kpdC'}
            };

            const url = new URL(request.url);
            const key = url.pathname.slice(1);
            const id = key.split("/")[1];
            return fetch('https://api.cloudflare.com/client/v4/accounts/41f6f507a22c7eec431dbc5e9670c73d/images/v1/'+id, options);
      }
      default:
      {
            return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'PUT, GET, DELETE', }, });
      }
    }
  },
};


