import {game} from "./game.js";
import {GAME_STATE} from "./enums.js";

let settings = {}

$('document').on('loaded', function () {
    // Set up k
})

export function switchPage(id) {
    let currentPage = $('.page.active')
    if (id === currentPage.attr('id'))
        return

    if (currentPage.id === 'settings')
        saveSettings()

    currentPage.children().css({right: 0, left: ''}).animate({right: "-150%"}, 600).promise().then(function () {
        currentPage.removeClass('active')

        let nextPage = $('#' + id)
        nextPage.addClass('active')

        nextPage.children().css({left: "-150%", right: ''}).animate({left: 0})
    })
}

export function switchToGame() {
    if (game.state === GAME_STATE.MENU) {
        game.start()
        $('#pages').fadeOut(1000)
    }
}

export function switchToMenu() {
    $('#pages').fadeIn(1000)
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
    if (game.state !== GAME_STATE.MENU)
        return

    let currentButton = $('.page.active > .page-item.active'),
        nextButton, prevButton

    if (currentButton.length === 0 || currentButton.next().length === 0)
        nextButton = $('.page.active > .page-item:first-child')
    else
        nextButton = currentButton.next()

    if (currentButton.length === 0 || currentButton.prev().length === 0)
        prevButton = $('.page.active > .page-item:last-child')
    else
        prevButton = currentButton.prev()

    switch (ev.code) {
        case 'ArrowDown':
        case 'KeyS':
            currentButton.removeClass('active')
            nextButton.addClass('active')

            break
        case 'ArrowUp':
        case 'KeyW':
            currentButton.removeClass('active')
            prevButton.addClass('active')

            break
        case 'Enter':
        case 'Space':
            currentButton.trigger('click')

            break
        case 'Escape':
        case 'Backspace':
            switchPage("menu")

            break
    }
}

$('html').on('keydown', null, null, menuKeyboardControl)


