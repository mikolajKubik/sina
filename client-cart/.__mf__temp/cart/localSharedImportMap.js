
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "svelte": async () => {
          let pkg = await import("__mf__virtual/cart__prebuild__svelte__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "svelte": {
            name: "svelte",
            version: "5.43.6",
            scope: ["default"],
            loaded: false,
            from: "cart",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"svelte"}' must be provided by host`);
              }
              usedShared["svelte"].loaded = true
              const {"svelte": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^5.43.6",
              
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      