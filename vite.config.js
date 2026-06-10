import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),

        customKeyboard3D: resolve(__dirname, "custom-keyboard-3D.html"),

        product1: resolve(__dirname, "product1.html"),
        product2: resolve(__dirname, "product2.html"),
        product3: resolve(__dirname, "product3.html"),
        product4: resolve(__dirname, "product4.html"),

        keyProduct1: resolve(__dirname, "key-product1.html"),
        keyProduct2: resolve(__dirname, "key-product2.html"),
        keyProduct3: resolve(__dirname, "key-product3.html"),
        keyProduct4: resolve(__dirname, "key-product4.html"),

        capsProduct1: resolve(__dirname, "caps-product1.html"),
        capsProduct2: resolve(__dirname, "caps-product2.html"),
        capsProduct3: resolve(__dirname, "caps-product3.html"),
        capsProduct4: resolve(__dirname, "caps-product4.html"),

        accProduct1: resolve(__dirname, "acc-product1.html"),
        accProduct2: resolve(__dirname, "acc-product2.html"),
        accProduct3: resolve(__dirname, "acc-product3.html"),
        accProduct4: resolve(__dirname, "acc-product4.html"),

        shopKeyboards: resolve(__dirname, "shop-keyboards.html"),
        shopKeycaps: resolve(__dirname, "shop-keycaps.html"),
        shopSwitches: resolve(__dirname, "shop-switches.html"),
        shopAcc: resolve(__dirname, "shop-acc.html"),

        policy: resolve(__dirname, "policy.html"),
        returnPolicy: resolve(__dirname, "return_policy.html"),

        contacts: resolve(__dirname, "about-me/contacts.html"),
        myStory: resolve(__dirname, "about-me/my-story.html")
      }
    }
  }
});