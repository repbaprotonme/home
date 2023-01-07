export default
{
  async fetch(request)
  {
        return new Response(JSON.stringify({ request }),
            {
                headers: { "Content-Type": "application/json" }
            });

  },
};
