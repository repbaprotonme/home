/*
// Install emsdk, source ./emsdk_env.sh
// Save this C code as minimal.c, then run:
// emcc minimal.c -Os -o minimal.js && base64 -w0 minimal.wasm > minimal.wasm.base64
// Copy the base64 file contents into base64data below.
#define HEIGHT 400
#define WIDTH 800
#include <emscripten.h>

int data[WIDTH * HEIGHT];
int red = (255 << 24) | 255;

int* EMSCRIPTEN_KEEPALIVE render() {
   for (int y = 0; y < HEIGHT; y++) {
     int yw = y * WIDTH;
     for (int x = 0; x < WIDTH; x++) {
       data[yw + x] = red;
     }
   }
   return &data[0];
}
*/

const width = 800;
const height = 400;

// Contains the actual webassembly
const base64data = 'AGFzbQEAAAABBQFgAAF/AhIBA2VudgZtZW1vcnkCAYACgAIDAgEABwsBB19yZW5kZXIAAApJAUcBA38DQCAAQaAGbCECQQAhAQNAIAEgAmpBAnRBgAhqQf+BgHg2AgAgAUEBaiIBQaAGRw0ACyAAQQFqIgBBkANHDQALQYAICw==';

const decode = (b64) => {
  const str = window.atob(b64);
  const array = new Uint8Array(str.length);
  for(let i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer;
};

const memSize = 256;
const memory = new WebAssembly.Memory({initial: memSize, maximum: memSize});

const instance = new WebAssembly.Instance(
  new WebAssembly.Module(new Uint8Array(decode(base64data))),
  { env: { memory } }
);

// Get 2d drawing context
const ctx = document.getElementById('c').getContext('2d');
const pointer = instance.exports._render();
const data = new Uint8ClampedArray(memory.buffer, pointer, width * height * 4);
const img = new ImageData(data, width, height);
ctx.putImageData(img, 0, 0);
