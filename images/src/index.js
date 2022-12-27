export default {
  async fetch(request, env) {

        const urli = new URL(request.url);
        const key = urli.pathname.split("/")[2]
        let url = 'https://api.cloudflare.com/client/v4/accounts/41f6f507a22c7eec431dbc5e9670c73d/images/v1/stats';
        let options = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer majjgSB2awSS1-8WJ7OoRvst4gsGjfLl3Fl0kpdC' }};
        let response = await fetch(url, options)
            .then(response => {return response.json();});

        let current = Number(response.result.count.current);
        var j = 1;
        var images = [];
        for (var n = 0; n < current; ++j, n+=100)
        {
            let url = "https://api.cloudflare.com/client/v4/accounts/41f6f507a22c7eec431dbc5e9670c73d/images/v1?page="+j+"&per_page=100";
            let options = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer majjgSB2awSS1-8WJ7OoRvst4gsGjfLl3Fl0kpdC' }};
            let response = await fetch(url,options)
                .then(response => {return response.json();});
            for (var m = 0; m < response.result.images.length; ++m)
            {
                var id = response.result.images[m].id;
                if (!id.startsWith(key))
                    continue;
                images.push(id);
            }
        }

        images.sort();
        return new Response(JSON.stringify(images));
    }
  }


