fetch("https://reportbase.com/gallery/_AA")
.then(function (response)
{
    return response.json();
})
.then(function (obj)
{
    console.log(obj);
})

