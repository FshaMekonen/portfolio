/**
 * typing.js
 * Handles typing/deleting animation for headline titles.
 */

class TypeWriter {
  constructor(element, words, wait = 3000) {
    this.element = element;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.element.innerHTML = `<span class="txt">${this.txt}</span><span class="cursor" aria-hidden="true">|</span>`;

    // Initial Type Speed
    let typeSpeed = 100;

    if (this.isDeleting) {
      typeSpeed /= 2; // erase twice as fast
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing again
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Initialize on DOMContentLoaded if the element exists
document.addEventListener('DOMContentLoaded', () => {
  const typeElement = document.querySelector('.typewrite');
  if (typeElement) {
    const words = JSON.parse(typeElement.getAttribute('data-type'));
    const wait = typeElement.getAttribute('data-period');
    new TypeWriter(typeElement, words, wait);
  }
});
