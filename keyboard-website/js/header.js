class SharedHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="main-header">
              <a href="index.html"><div class="logo">
                  <h2>THOK</h2>
              </div></a>
              <nav class="nav-links">
                  <a href="shop-keyboards.html">Custom Keyboards</a>
                  <a href="shop-keyboards.html">Wireless Keyboards</a>
                  <a href="#">Keycaps</a>
                  <a href="#">Switches</a>
                  <a href="#">Accessories</a>
              </nav>
              <div class="nav-icons">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <i class="fa-regular fa-user"></i>
                  <i class="fa-solid fa-cart-shopping"></i>
              </div>
          </header>
        `;
    }
}

// This tells the browser that <shared-header></shared-header> is a valid HTML tag
customElements.define('shared-header', SharedHeader);

class FolderSharedHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="main-header">
              <a href="../index.html"><div class="logo">
                  <h2>THOK</h2>
              </div></a>
              <nav class="nav-links">
                  <a href="../shop-keyboards.html">Custom Keyboards</a>
                  <a href="../shop-keyboards.html">Wireless Keyboards</a>
                  <a href="#">Keycaps</a>
                  <a href="#">Switches</a>
                  <a href="#">Accessories</a>
              </nav>
              <div class="nav-icons">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <i class="fa-regular fa-user"></i>
                  <i class="fa-solid fa-cart-shopping"></i>
              </div>
          </header>
        `;
    }
}
customElements.define('folder-shared-header', FolderSharedHeader);