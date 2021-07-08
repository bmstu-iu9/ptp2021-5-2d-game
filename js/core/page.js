import {game} from "./game.js";
import {CONTROLS} from "./enums.js";

let settings = {
    controls: CONTROLS.ARROWS
}

export function switchPage(id) {
    let currentPage = $('.page.active')
    if (id === currentPage.id)
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
    game.start()
    $('#pages').fadeOut(1000)
}

export function switchToMenu() {
    $('#pages').fadeIn(1000)
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        // при необходимости добавьте другие значения по умолчанию
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
    settings.controls = $('#controls-select').prop("value") === "wasd" ? CONTROLS.WASD : CONTROLS.ARROWS

    setCookie("gameSettings", JSON.stringify(settings))
}

function loadSettings() {
    let savedSettings = getCookie("gameSettings")
    if (savedSettings !== undefined)
        settings = JSON.parse(savedSettings)

    $('#controls-select').prop("value", settings.controls)
}

$(document).ready(function () {
    loadSettings()
    $('select').niceSelect()
})


