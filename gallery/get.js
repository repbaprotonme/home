//fetch("https://tomwork.reportbase5836.workers.dev/CITY")
fetch("curl -H https://api.cloudflare.com/client/v4/accounts/41f6f507a22c7eec431dbc5e9670c73d/images/v1/WALLA.0002 'Authorization: Bearer majjgSB2awSS1-8WJ7OoRvst4gsGjfLl3Fl0kpdC' ")
.then(function (response)
{
    return response.json();
})
.then(function (obj)
{
    console.log(obj);
})

