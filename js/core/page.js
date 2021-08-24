import {game} from "./game.js";

export {switchPage, switchToGame, switchToMenu}

let settings = {}

window.addEventListener('load', function () {
    window.addEventListener('keydown', menuKeyboardControl)
})

/**
 * Change current page to page with given id.<br>Elements of the current page will slide out to the right, elements
 * of the
 * next page will slide in from the left.
 *
 * @param id id attribute of the next page's HTMLElement
 * @param transitionDuration duration of slide-out and slide-in transitions (in milliseconds). Total time taken to
 * switch the page will be around double this number.
 */
function switchPage(id, transitionDuration = 600) {
    const currentPage = document.querySelector('.page.active') || document.querySelector('.page:first-child'),
        nextPage = document.getElementById(id)

    if (id === currentPage.id)
        return

    // If switching from settings, save settings
    if (currentPage.id === 'settings')
        saveSettings()

    let i = 0
    for (let child of currentPage.children) {
        child.style.left = ''
        child.style.right = '-150%'
        child.animate([{right: '0'}, {right: '-150%'}], {duration: transitionDuration + i * 100, easing: 'ease-in'})

        i++
    }

    setTimeout(function () {
        currentPage.classList.remove('active')
        nextPage.classList.add('active')

        i = 0
        for (let child of nextPage.children) {
            child.style.right = ''
            child.animate([{left: '-150%'}, {left: '0'}], {duration: transitionDuration + i * 100, easing: 'ease-out'})
            i++
        }
    }, transitionDuration + i * 100 - 10)
}

/**
 * Fade out menu and start the game.
 */
function switchToGame() {
    let pagesElement = document.getElementById('pages')
    fadeToggle(pagesElement, game.start.bind(game))
}

/**
 * Hide the game and fade in menu.
 */
function switchToMenu() {
    let pagesElement = document.getElementById('pages')
    fadeToggle(pagesElement, null)
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

export function saveSettings() {
    setCookie("gameSettings", JSON.stringify(settings))
}

function loadSettings() {
    let savedSettings = getCookie("gameSettings")
    if (savedSettings !== undefined)
        settings = JSON.parse(savedSettings)

    // Change settings' elements here
}

function menuKeyboardControl(ev) {
    let currentButton = document.querySelector('.page.active > .page-item.active'),
        nextButton, prevButton

    if (!currentButton || !currentButton.nextElementSibling)
        nextButton = document.querySelector('.page.active > .page-item:first-child')
    else
        nextButton = currentButton.nextElementSibling

    if (!currentButton || !currentButton.previousElementSibling)
        prevButton = document.querySelector('.page.active > .page-item:last-child')
    else
        prevButton = currentButton.previousElementSibling

    switch (ev.code) {
        case 'ArrowDown':
        case 'KeyS':
            currentButton.classList.remove('active')
            nextButton.classList.add('active')

            break
        case 'ArrowUp':
        case 'KeyW':
            currentButton.classList.remove('active')
            prevButton.classList.add('active')

            break
        case 'Enter':
        case 'Space':
            currentButton.dispatchEvent(new Event('click'))

            break
        case 'Escape':
        case 'Backspace':
            switchPage("menu")

            break
    }
}

/**
 * Toggle the visibility of given element.<br>
 * This method animates element's opacity (animation speed is defined in style.css -> .fadeable). When opacity
 * reaches 0 after hiding animation, the `display` style property is set to `none` to ensure that the element no
 * longer affects the layout of the page.
 *
 * @param element {HTMLElement} element to fade in/out
 * @param callback {function | null} function to execute once transition is over
 */
function fadeToggle(element, callback) {
    element.style.display = ''

    element.addEventListener('transitionend', function () {
        this.style.display = this.classList.contains('hidden') ? 'none' : ''
        if (callback) callback()
    }, {once: true})

    setTimeout(() => {element.classList.toggle('hidden')}, 20)
}