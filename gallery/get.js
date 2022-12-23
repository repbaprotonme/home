fetch("https://tomwork.reportbase5836.workers.dev/CITY")
.then(function (response)
{
    return response.json();
})
.then(function (obj)
{
    console.log(obj);
})

