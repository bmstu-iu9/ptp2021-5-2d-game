import {game} from "./game.js";

export function switchPage(id) {
    let currentPage = $('.page.active')
    if (id === currentPage.id)
        return

    currentPage.children().css({right: 0}).animate({right: "-150%"}, 600).promise().then(function () {
        currentPage.removeClass('active')

        let nextPage = $('#' + id)
        nextPage.addClass('active')

        nextPage.children().css({left: "-150%"}).animate({left: 0})
    })
}

export function switchToGame() {
    game.start()
    $('#pages').fadeOut(1000)
}

export function switchToMenu() {
    $('#pages').fadeIn(1000)
}

