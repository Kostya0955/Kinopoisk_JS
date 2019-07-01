const searchForm = document.querySelector('#search-form')
const movie = document.querySelector('#movies')
const urlPoster = 'https://image.tmdb.org/t/p/w500'

function apiSearch (event) {
  event.preventDefault()
  const searchText = document.querySelector('.form-control').value
  if (searchText.trim().length === 0) {
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>'
    return
  }
  const server = 'https://api.themoviedb.org/3/search/multi?api_key=0c3e865e799c012a67547387e5f60967&language=ru&query=' + searchText
  movie.innerHTML = '<div class="spinner"></div>'
  fetch(server)
    .then(function (value) {
      if (value.status !== 200) {
        return Promise.reject(new Error(value.status))
      }
      return value.json() // парсим данные и передаем их в другой then
    })
    .then(function (output) {
      let inner = ''
      if (output.results.length === 0) {
        inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>'
      }
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title
        const poster = item.poster_path ? urlPoster + item.poster_path : '/./img/noPoster.jpg'
        let dataInfo = ''
        if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`
        inner += `
              <div class="col-md-6 item">
                <img src = "${poster}"  class= "img_poster "alt = "${nameItem}" ${dataInfo}>
              <h5>${nameItem}</h5>
                
              </div>
         `
      })
      movie.innerHTML = inner

      addEventMedia()
    })
    .catch(function (reason) {
      movie.innerHTML = 'Упс, что-то пошло не так!'
      console.log('error:' + reason.status)
    })
}

searchForm.addEventListener('submit', apiSearch)

function addEventMedia () {
  const media = movie.querySelectorAll('img[data-id]')
  media.forEach(function (elem) {
    elem.style.cursor = 'pointer'
    elem.addEventListener('click', showFullInfo)
  })
}

function showFullInfo () {
  let url = ''
  if (this.dataset.type === 'movie') {
    // будем вставлять тот id фильма, на который кликнули
    url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=0c3e865e799c012a67547387e5f60967&language=ru'
  } else if (this.dataset.type === 'tv') {
    url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=0c3e865e799c012a67547387e5f60967&language=ru'
  } else {
    movie.innerHTML = '<h2 class="col-12 text-center text-info">Произошла ошибка, повторите позже</h2>'
  }

  fetch(url)
    .then(function (value) {
      if (value.status !== 200) {
        return Promise.reject(new Error(value.status))
      }
      return value.json() // парсим данные и передаем их в другой then
    })
    .then((output) => {
      // console.log(output);
      movie.innerHTML = `
        <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
        <div class="col-4"> 
        <img src='${urlPoster + output.poster_path}' alt='${output.name || output.title}'>
        ${(output.homepage) ? `<p class='text-center'> <a href="${output.homepage}"  target="_blank" >Официальная страница </a> </p>` : ''}
        ${(output.imdb_id) ? `<p class='text-center'> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank" >Стрнаица на IMDB.com </a> </p>` : ''}
        </div>
        <div class = "col-8">
        <p>Рейтинг: ${output.vote_average} </p>
        <p>Cтатус: ${output.status} </p>
        <p>Премьера: ${output.first_air_date || output.release_date} </p>
        ${(output.last_episode_to_air) ? ` <p>${output.number_of_seasons} сезон
        ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}
           <p> Описание: ${output.overview}</p>
             <br>
        <div class='youtube'></div>
        </div> 
        `

      getVideo(this.dataset.type, this.dataset.id)
    })
    .catch(function (reason) {
      movie.innerHTML = 'Упс, что-то пошло не так!'
      console.log('error:' + reason.status)
    })
}

// тренды за неделю
document.addEventListener('DOMContentLoaded', function () {
  fetch('https://api.themoviedb.org/3/trending/all/week?api_key=0c3e865e799c012a67547387e5f60967&language=ru')
    .then(function (value) {
      if (value.status !== 200) {
        return Promise.reject(new Error(value.status))
      }
      return value.json() // парсим данные и передаем их в другой then
    })
    .then(function (output) {
      let inner = '<h2 class="col-12 text-center text-info">Популярные за неделю</h2>'
      if (output.results.length === 0) {
        inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>'
      }
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title
        // добавляем в популярные тег data-type
        let mediaType = item.title ? 'movie' : 'tv'
        const poster = item.poster_path ? urlPoster + item.poster_path : '/./img/noPoster.jpg'
        let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`
        inner += `
              <div class="col-3 item">
                <img src = "${poster}"  class= "img_poster "alt = "${nameItem}" ${dataInfo}>
              <h5>${nameItem}</h5>
                
              </div>
         `
      })
      movie.innerHTML = inner

      addEventMedia()
    })
    .catch(function (reason) {
      movie.innerHTML = 'Упс, что-то пошло не так!'
      console.log('error:' + reason.status)
    })
})
// данные для ютуба
function getVideo (type, id) {
  let youtube = movie.querySelector('.youtube')
  fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=0c3e865e799c012a67547387e5f60967&language=ru`)
    .then((value) => {
      if (value.status !== 200) {
        return Promise.reject(new Error(value.status))
      }
      return value.json() // парсим данные и передаем их в другой then
    })
    .then((output) => {
      let videoFrame = '<h5 class="col-12  text-info">Трейлеры:</h5>'
      if (output.results.length === 0) {
        videoFrame = '<p>К сожалению, видео отсутствует</p>'
      }
      output.results.forEach((item) => {
        videoFrame += '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + item.key + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
      })
      youtube.innerHTML = videoFrame
    })
    .catch((reason) => {
      youtube.innerHTML = 'Видео отсутствует'
      console.log(reason || reason.status)
    })
}
