export default {
  async fetch(request) {

    switch (request.method) {
      case 'PUT':
      {
      }
      case 'GET':
      {
      }
      case 'DELETE':
      {
      }
      default:
      {
            return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'PUT, GET, DELETE', }, });
      }
    }
  },
};


