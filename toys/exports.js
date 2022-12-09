
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


const runWasm = async () =>
{
    const wasmModule = await wasmBrowserInstantiate("back/exports.wasm");
    const exports = wasmModule.instance.exports;
    console.log(exports.callMeFromJavascript(24, 24))
    console.log(exports.GET_THIS_CONSTANT_FROM_JAVASCRIPT.valueOf());
    console.log(exports.addIntegerWithConstant);
};

runWasm();

