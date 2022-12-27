export default {
  async fetch(request) {

    const { searchParams, href, search } = new URL(request.url)
    var j = request.url.split("/")
    let id = j[j.length-2]
    let options = j[j.length-1]
    let k = 'https://imagedelivery.net/w9Lvwo1EAmYzHfbI5TkJ7g/'+id+'/'+options
    return fetch(k);

  },
};
