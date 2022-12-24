export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    switch (request.method) {
      case 'PATCH':
            let urla = 'https://api.cloudflare.com/client/v4/accounts/41f6f507a22c7eec431dbc5e9670c73d/images/v1?page=1&per_page=100';
            let optionsa = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer majjgSB2awSS1-8WJ7OoRvst4gsGjfLl3Fl0kpdC' }};
            let response = await fetch(urla,optionsa);
            return response;
      case 'PUT':
        await env.MY_BUCKET.put(key, request.body);
        return new Response(`Put ${key} successfully!`);
      case 'GET':
        const object = await env.MY_BUCKET.get(key);
        if (object === null)
          return new Response('Object Not Found', { status: 404 });
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        return new Response(object.body, { headers, });

      case 'DELETE':
        await env.MY_BUCKET.delete(key);
        return new Response('Deleted!');

      default:
        return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'PUT, GET, DELETE, PATCH', }, });
    }
  },
};


