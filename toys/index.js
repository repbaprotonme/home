
export const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) =>
{
    let response = undefined;

    if (!importObject)
    {
        importObject =
        {
          env: { abort: () => console.log("Abort!") }
        };
    }

    if (WebAssembly.instantiateStreaming)
    {
        response = await WebAssembly.instantiateStreaming( fetch(wasmModuleUrl), importObject);
    }
    else
    {
        const fetchAndInstantiateTask = async () => {
              const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response => response.arrayBuffer());
              return WebAssembly.instantiate(wasmArrayBuffer, importObject);
            };

        response = await fetchAndInstantiateTask();
    }

    return response;
};

const runWasm = async () => {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("index.wasm");

  // Get our exports object, with all of our exported Wasm Properties
  const exports = wasmModule.instance.exports;

  // Get our memory object from the exports
  const memory = exports.memory;

  // Create a Uint8Array to give us access to Wasm Memory
  const wasmByteMemoryArray = new Uint8Array(memory.buffer);

  // Let's read index zero from JS, to make sure Wasm wrote to
  // wasm memory, and JS can read the "passed" value from Wasm
  console.log(wasmByteMemoryArray[0]); // Should Log "24".
  // Next let's write to index one, to make sure we can
  // write wasm memory, and Wasm can read the "passed" value from JS
  wasmByteMemoryArray[1] = 15;
  console.log(exports.readWasmMemoryAndReturnIndexOne()); // Should Log "15"
  document.body.textContent = wasmByteMemoryArray[0];
};
runWasm();

