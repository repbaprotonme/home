const url = new URL("https://reportbase.com/image/XXX");
const key = url.pathname.slice(1);
const id = key.split("/")[1];
console.log(key,id)
