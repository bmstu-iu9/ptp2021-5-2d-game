import {game} from "./game.js"

export {setCurrentPage, switchToGame, switchToMenu}

window.addEventListener('load', pageLoaded)

/**
 * Show game menu and setup keyboard control in menu.<br>
 * This function should be executed once the page has completely loaded.
 */
function pageLoaded() {
    const pagesElement = document.getElementById("pages")

    pagesElement.style.display = ''
    pagesElement.animate([
        {opacity: 0},
        {opacity: 1}
    ], {duration: 1000})

    setCurrentPage('menu', 900).then(() => {
        window.addEventListener('keydown', menuKeyboardControl)
    })
}

/**
 * Change current page to page with given id.<br>
 * Elements of the current page will slide out to the right, elements of the
 * next page will slide in from the left.
 *
 * @param id {String} id attribute of the next page's HTMLElement. If not passed or equals to `null`, no page will be
 * set active.
 * @param transitionDuration {Number} duration of slide-out and slide-in transitions (in milliseconds). Total time
 * taken to
 * switch the page will be around double this number.
 *
 * @returns {Promise} a Promise object which will resolve once the transition has finished.
 */
function setCurrentPage(id, transitionDuration = 600) {
    return new Promise(function (resolve, reject) {
        const currentPage = document.querySelector('.page.active'),
            nextPage = id ? document.getElementById(id) : null

        if (currentPage && id === currentPage.id)
            return resolve()

        let lastAnimation
        if (!currentPage || !currentPage.children) {
            lastAnimation = {
                finished: {
                    then: (f) => {
                        f()
                    }
                }
            }
        } else {
            Array.from(currentPage.children).forEach(function (child, index) {
                child.style.left = ''
                child.style.right = '-150%'

                lastAnimation = child.animate([{right: '0'}, {right: '-150%'}],
                    {duration: transitionDuration + index * 100, easing: 'ease-in'})
            })
        }

        lastAnimation.finished.then(function () {
            if (currentPage)
                currentPage.classList.remove('active')

            if (!nextPage || !nextPage.children)
                return resolve()

            nextPage.classList.add('active')

            Array.from(nextPage.children).forEach(function (child, index) {
                child.style.right = ''
                lastAnimation = child.animate([{left: '-150%'}, {left: '0'}],
                    {duration: transitionDuration + index * 100, easing: 'ease-out'})
            })

            lastAnimation.finished.then(resolve)
        })

    })
}

/**
 * Fade out menu and transition to menu.
 */
function switchToGame() {
    setCurrentPage(null).then(function () {
        let pagesElement = document.getElementById('pages'),
            playerElement = document.getElementById('player'),
            planetElement = document.getElementById('planet')
        const transitionDuration = 2200

        playerElement.style.display = ''
        playerElement.animate([
            {width: '0', height: '0', marginLeft: '0', marginTop: '0'},
            {width: '70px', height: '70px', marginLeft: '-35px', marginTop: '-35px'}
        ], {duration: transitionDuration, easing: 'ease-in'})

        game.backgroundObjects.render(game.context) // display space background on canvas
        game.viewport.animate([
            {opacity: '0'},
            {opacity: '1'}
        ], {duration: transitionDuration, easing: 'ease-in'})

        // Planet's center stays the same while the planet shrinks.
        planetElement.animate([
            {width: '90%', height: '90%', top: '5%', left: '5%'},
            {width: '0', height: '0', top: '50%', left: '50%'},
        ], {duration: transitionDuration - 500, delay: 500, easing: 'ease-in'}).finished.then(() => {
            pagesElement.style.display = 'none'
            game.start()
        })
    })
}

/**
 * Fade out the game and show menu.
 */
function switchToMenu() {
    let pagesElement = document.getElementById('pages'),
        playerElement = document.getElementById('player')
    const transitionDuration = 2200

    pagesElement.style.display = ''
    playerElement.style.display = 'none'

    game.backgroundObjects.render(game.context)
    game.viewport.animate([
        {opacity: '1'},
        {opacity: '0'}
    ], {duration: transitionDuration, easing: 'ease-in'})

    document.getElementById("planet").animate([
        {width: '0', height: '0', top: '50%', left: '50%'},
        {width: '90%', height: '90%', top: '5%', left: '5%'},
    ], {duration: transitionDuration}).finished.then(() => {
        game.context.clearRect(0, 0, game.viewport.width, game.viewport.height)
        setCurrentPage('menu')
    })
}

/**
 * Handle pressed key while in game menu.<br>
 * This function should be attached as listener to "`keydown`" event.
 *
 * @param ev {KeyboardEvent} a KeyboardEvent passed by "`keydown`" event
 */
function menuKeyboardControl(ev) {
    if (game.state !== 1)
        return

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
            setCurrentPage("menu")

            break
    }
}
