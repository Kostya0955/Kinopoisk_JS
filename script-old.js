const searchForm = document.querySelector('#search-form')
const movie = document.querySelector('#movies')

function apiSearch(event) {
    event.preventDefault()
    const searchText = document.querySelector('.form-control').value
    server = 'https://api.themoviedb.org/3/search/multi?api_key=0c3e865e799c012a67547387e5f60967&language=ru&query=' + searchText
    requestApi(server)
        .then(function (result) {
            const output = JSON.parse(result) // делает из json объект
            console.log(output)
            let inner = ''
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title
                inner += '<div class="col-12">' + nameItem + '</div>'
            })
            movie.innerHTML = inner
        })

        .catch(function (reason) {
            movie.innerHTML = 'Упс, что-то пошло не так!'
            console.log('error:' + reason.status)
        })
}

searchForm.addEventListener('submit', apiSearch)

// обращение к API
function requestApi(url) {
    return new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest()
        request.open('GET', url) // куда мы передаем запрос

        request.addEventListener('load', function () {
            if (request.status !== 200) { //! ==200 так как 404 тоже пападет в это условие
                return
            }
            resolve(request.response) // ответ от сервера ( передается в then)
        })

        request.addEventListener('error', function () {
            reject({
                status: request.status
            })
        })
        request.send() // отправка на сервер. после этой команды ждем ответ от севера
    })
}
