async function loadNames()
{
    const response = await fetch('https://reportbase.com/images/AG');
    var text = await response.json();

    for (var n = 0; n < text.length; ++n)
    {
        var k = text[n];
        console.log(k);
    }

}

loadNames();







