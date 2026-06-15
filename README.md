# Product list with cart solution

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Add items to the cart and remove them
- Increase/decrease the number of items in the cart
- See an order confirmation modal when they click "Confirm Order"
- Reset their selections when they click "Start New Order"
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![](./preview.jpg)

### Links

- Solution URL: [GitHub Repository](https://github.com/abdou/product-list-with-cart)
- Live Site URL: [GitHub Pages / Live Site](https://abdou.github.io/product-list-with-cart/)

## My process

### Built with

- Semantic HTML5 markup
- CSS Custom Properties (Variables)
- Flexbox & CSS Grid for responsive layouts
- Vanilla JavaScript (ES6+) for state management & DOM manipulation
- Mobile-first workflow

### What I learned

During this project, I focused on writing clean, modular Vanilla JavaScript for state management and handling interactive UI elements (like the stepper button and modal) without any external framework.

For example, I implemented a simple `CartStore` object to centralize the state logic for adding, removing, and updating product quantities:

```js
const CartStore = {
  items: new Map(), // name -> { product, quantity }
  
  add(product) {
    if (this.items.has(product.name)) {
      this.increment(product.name);
    } else {
      this.items.set(product.name, { product, quantity: 1 });
    }
  },
  // ...
};
```

I also leveraged the native HTML5 `<dialog>` element for the order confirmation modal, which provides built-in accessibility features and easy methods like `showModal()` and `close()`:

```js
function openModal() {
  // ... render modal contents
  orderModal.showModal();
}

function closeModal() {
  orderModal.close();
}
```

### Continued development

In future projects, I would like to explore:
- Enhancing web accessibility (using ARIA attributes and improving keyboard navigation).
- Implementing CSS transitions/animations for a smoother cart update experience.
- Transitioning to a component-driven framework like React or Vue for more complex application states.

## Author

- Frontend Mentor - [@BLHDeveloper](https://www.frontendmentor.io/profile/BLHDeveloper)
