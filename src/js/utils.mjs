// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(key) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(key);
}

/**
 * Get a .html file template string
 * @param {string} path - the actual path to look. Should be in public
 */
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

/**
 * Render a template based on a .html file
 * @param { string } template - The template to be populated
 * @param { HTMLElement } parentElement - the Element to be populated using .innerHTML
 * @param { (...args) => void } callback - a callback to be called to populate the template.
 */
export async function renderWithTemplate(template, parentElement, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback();
  }
}
