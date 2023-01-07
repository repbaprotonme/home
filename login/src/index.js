export default
{
  async fetch(request)
  {
      return Response.redirect("https://reportbase.com/", 301);
      return new Response(JSON.stringify({ request }),
            {
                headers: { "Content-Type": "application/json" }
            });

  },
};
