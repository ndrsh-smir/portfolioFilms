// Массив с премьерами

const premieres = [
    {
      name: "Аватар 3",
      poster: "img/films/avatar3.jpg",
      date: "2024-12-19"
    },
    {
      name: "Барби",
      poster: "img/films/barbie.webp",
      date: "2023-09-19"
    },
    {
      name: "Человек-паук: Паутина вселенных",
      poster: "img/films/spiderman.jpg",
      date: "2023-11-02"
    },
    {
      name: "Чебурашка",
      poster: "img/films/cheburashka.jpg",
      date: "2023-01-01"
    }
  ];

// Обращение к пользователю в зависимости от имени и времени

const helloSelector = document.querySelector('#hello'),
      nameSelector = document.querySelector('#name'),
      date = new Date,
      hoursNow = date.getHours();

if (hoursNow >= 6 && hoursNow <= 11){
    helloSelector.textContent = 'Доброе утро';
} else if (hoursNow >= 12 && hoursNow <= 16){
    helloSelector.textContent = 'Добрый день';
} else if (hoursNow >= 17 && hoursNow <= 21){
    helloSelector.textContent = 'Добрый вечер';
} else {
    helloSelector.textContent = 'Доброй ночи';
}

let userName = localStorage.getItem("name") || 'Пользователь';
nameSelector.textContent = userName;

nameSelector.addEventListener('click', () => {
    let newName;

    do {
        newName = prompt('Введите ваше имя');
        if (newName === null) return;
    } while (!newName.trim() || newName.length > 15);

    if (newName.trim() != userName){
        userName = newName.trim();
        localStorage.setItem('name', userName);
        nameSelector.textContent = userName;
    }
})


// Простой слайдер

// const slider = document.querySelector('.slider'),
//       slides = document.querySelectorAll('.slider__item'),
//       prev = document.querySelector('.slider__arrow--prev'),
//       next = document.querySelector('.slider__arrow--next');

// let slideIndex = 0;

// function changeSlide(change = 0) {
//     slideIndex += change;

//     slides.forEach(item => item.style.display = 'none');
//     slides[slideIndex%slides.length].style.display = 'block'; //В процессе понял, что взяв остаток можно обойтись без условий вообще
// }

// prev.addEventListener('click', () => changeSlide(-1));
// next.addEventListener('click', () => changeSlide(1));

// changeSlide();


// Не простой слайдер

const slider = document.querySelector('.slider'),
      slidesField = slider.querySelector('.slider__inner');


premieres.forEach((item, index) => {
    slidesField.innerHTML += `
        <div class="slider__item" data-slider-item="${index}">
        <img src="${item.poster}" alt="" class="slider__preview">

        <div class="slider__text">
            <h3 class="slider__title">${item.name}</h3>
            <div class="timer">
            
            </div>
        </div>
        </div>
    `;

    setClock(item, index);
    setInterval(setClock, 1000, item, index);
})

function setClock(item, index){
    const timer = slider.querySelector(`[data-slider-item="${index}"] .timer`);
    
    const t = Date.parse(item.date) - Date.now(),
          days = Math.floor(t / 1000 / 60 / 60 / 24);

    if (t > 0 && days < 100){
        const seconds = Math.floor((t / 1000) % 60),
              minutes = Math.floor((t / 1000 / 60) % 60),
              hours = Math.floor((t / 1000 / 60 / 60) % 24);
                
        timer.innerHTML = `
        <div class="timer__row">
            <div class="timer__item">
                <span class="timer__count">${getZero(days)}</span>
                дней
            </div>
            <div class="timer__item">
                <span class="timer__count">${getZero(hours)}</span>
                часов
            </div>
            <div class="timer__item">
                <span class="timer__count">${getZero(minutes)}</span>
                минут
            </div>
            <div class="timer__item">
                <span class="timer__count">${getZero(seconds)}</span>
                секунд
            </div>
        </div>
        `;
    } else if (t <= 0){
        timer.innerHTML = `<p class="timer__desc">Премьера состоялась ${convertDate(item.date)} <button class="timer__link">Оценить</button></p>`;
    } else{
        timer.innerHTML = `<p class="timer__desc">Премьера состоится ${convertDate(item.date)} <button class="timer__link">Оценить</button></p>`;
    }

    function getZero(num){
        if (num<10 && num >= 0){
            return `0${num}`
        } else return num;
    }

    function convertDate(date){
        date = date.split("-");
        const year = date[0];
        date[0] = date[2];
        date[2] = year;
        return date = date.join('.');
    }
}

const   slides = slider.querySelectorAll('.slider__item'),
        prev = slider.querySelector('.slider__arrow--prev'),
        next = slider.querySelector('.slider__arrow--next'),
        slidesWindow = slider.querySelector('.slider__wrapper'),
        widthSlideWithPx = window.getComputedStyle(slidesWindow).width,
        widthSlide = +widthSlideWithPx.slice(0, widthSlideWithPx.length - 2);

let slideIndex = 0,
    offset = -(widthSlide * slideIndex);

// slides.forEach(slide => slide.style.width = widthSlideWithPx);
slidesField.style.width = 100 * slides.length + "%"; 

next.addEventListener('click', () => {
    offset -= widthSlide;

    slideIndex += 1;
    moveSlides();

})

prev.addEventListener('click', () => {
    offset += widthSlide;

    slideIndex -= 1;
    moveSlides();
})

function showAndHideArrows(){
    if (slides.length <= 1){
        prev.style.display = 'none';
        next.style.display = 'none';
    } else if (slideIndex == 0){
        prev.style.display = 'none';
        next.style.display = 'block';
    } else if(slideIndex == slides.length - 1){
        prev.style.display = 'block';
        next.style.display = 'none';
    } else {
        prev.style.display = 'block';
        next.style.display = 'block';
    }
}


showAndHideArrows();


// Индикаторы для слайдера

const indicators = document.createElement('ol');
indicators.classList.add('slider__indicators');

slider.append(indicators);

for (let i = 0; i < slides.length; i++){
    if (slides.length <= 1 || slides.length >= 7) break;

    const dot = document.createElement('li');
    dot.classList.add('slider__dot');
    dot.setAttribute('data-slide-index', i);

    if (i == slideIndex) dot.classList.add('slider__dot--active');

    dot.addEventListener('click', () => {
        slideIndex = dot.getAttribute('data-slide-index');

        offset = -(widthSlide * slideIndex);
        moveSlides();

    })

    indicators.append(dot);
}


const dots = indicators.querySelectorAll('.slider__dot');

function moveSlides(){
    slidesField.style.transform = `translate(${offset}px)`;
    showAndHideArrows();

    dots.forEach(dot => dot.classList.remove('slider__dot--active'));
    dots[slideIndex].classList.add('slider__dot--active');
}

moveSlides();


// Подгружаем кинотеку на страницу
const films = [
    {
      name: "Зверополис",
      poster: "img/films/zootopia.webp",
      rating: 10,
      genre: "Мультфильм",
      favourite: true
    },
    {
      name: "Кто я",
      poster: "img/films/whoami.jpg",
      rating: 7,
      genre: "Фильм",
      favourite: false
    },
    {
      name: "Бывает и хуже",
      poster: "img/films/themiddle.webp",
      rating: 9,
      genre: "Сериал",
      favourite: true
    },
    {
      name: "Я на перемотке!",
      poster: "img/films/more/roll.jpeg",
      rating: 3,
      genre: "Фильм",
      favourite: false
    },
    {
      name: "Бэймакс!",
      poster: "img/films/more/baymax.webp",
      rating: 6,
      genre: "Мультфильм",
      favourite: false
    },
    {
      name: "Как я встретил вашу маму",
      poster: "img/films/more/mother.webp",
      rating: 7,
      genre: "Сериал",
      favourite: true
    },
    {
      name: "Валли",
      poster: "img/films/more/walle.webp",
      rating: 9,
      genre: "Мультфильм",
      favourite: false
    },
    {
      name: "Трудности ассимиляции",
      poster: "img/films/more/fresh.webp",
      rating: 8,
      genre: "Сериал",
      favourite: false
    },
    {
      name: "Молодой человек",
      poster: "img/films/more/young.webp",
      rating: 7,
      genre: "Фильм",
      favourite: false
    },
    {
      name: "Неисправимый Рон",
      poster: "img/films/more/ron.webp",
      rating: 10,
      genre: "Мультфильм",
      favourite: true
    },
    {
      name: "Клаус",
      poster: "img/films/more/klaus.webp",
      rating: 10,
      genre: "Мультфильм",
      favourite: false
    },
    {
      name: "Ральф против интернета",
      poster: "img/films/more/ralph.webp",
      rating: 2,
      genre: "Мультфильм",
      favourite: false
    },
    {
      name: "Отель «Гранд Будапешт»",
      poster: "img/films/more/hotel.webp",
      rating: 1,
      genre: "Фильм",
      favourite: false
    },
    {
      name: "Друзья",
      poster: "img/films/more/friends.webp",
      rating: 6,
      genre: "Сериал",
      favourite: false
    },
    {
      name: "Голдберги",
      poster: "img/films/more/goldbergs.webp",
      rating: 5,
      genre: "Сериал",
      favourite: false
    },
    {
      name: "Побег",
      poster: "img/films/more/prisonbreak.webp",
      rating: 9,
      genre: "Сериал",
      favourite: true
    },
    {
      name: "В метре друг от друга",
      poster: "img/films/more/apart.webp",
      rating: 6,
      genre: "Фильм",
      favourite: true
    },
    {
      name: "Чудо",
      poster: "img/films/more/wonder.webp",
      rating: 3,
      genre: "Фильм",
      favourite: false
    },
    {
      name: "Малыш на драйве",
      poster: "img/films/more/driver.webp",
      rating: 9,
      genre: "Фильм",
      favourite: true
    },
    {
      name: "С любовью, Рози",
      poster: "img/films/more/rosie.webp",
      rating: 7,
      genre: "Фильм",
      favourite: true
    },
  ];

const filmsSelector = document.querySelector('.films'),
      filmsWrapper = filmsSelector.querySelector('.films__wrapper');

function addFilmsOnPage(films){
    if (films.length == 0){
        filmsWrapper.innerHTML = "<p>Фильмы не найдены</p>";
    } else {

        filmsWrapper.innerHTML = `  <div class="loader loader--style3" title="2">
            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
            <path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
            <animateTransform attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.6s"
                repeatCount="indefinite"/>
            </path>
            </svg>
        </div>`;




        let filmsText = "";

        films.forEach(film => {

            const favourite = film.favourite ? "checked": "";

            filmsText += `
        <div class="film">
            <img src="${film.poster}" alt="" class="film__poster">
            <div class="film__content">
              <div class="film__content-row">
                <div class="rating film__rating">${film.rating}</div>
                <label class="film__favourite favourite">
                  <input type="checkbox" name="favourite" class="favourite__checkbox" ${favourite}>
                  <span class="favourite__heart"></span>
                </label>
              </div>
              <div class="film__content-row">
                <h4 class="film__name">${film.name}</h4>
                <div class="film__genre">${film.genre}</div>
              </div>
            </div>
          </div>
            `;
        });

        setTimeout(() => filmsWrapper.innerHTML = filmsText, 500);
    }
}

addFilmsOnPage(films);


// Фильтрация


let formSelector = document.querySelector('.films__form');

let favouriteSelector = document.querySelector('input[name="favourites"]');

let bestSelector = document.querySelector('input[name="best"]');

let genresSelector = document.querySelectorAll('input[name="genre"]');

let sortSelector = document.querySelector('select[name="sort"]');

formSelector.addEventListener('change', () => {
    const filters = {genres: []};

    genresSelector.forEach(item => {
        if (item.checked) filters.genres.push(item.value);
    })

    if (favouriteSelector.checked) filters.favourite = true;
    if (bestSelector.checked) filters.best = true;

    let filteredFilms = filterFilms(films, filters);

    if (sortSelector != "Без сортировки"){
        let filteredAndSortedFilms = sortFilms(filteredFilms, sortSelector.value);
    } 

    addFilmsOnPage(filteredFilms);
});

function filterFilms(films, filters) {
    let filteredFilms = [];

    if (filters.favourite && filters.best){
        films.forEach(film => {
            if(film.favourite && film.rating >= 8) checkGenres(film);
        })
    } else if (filters.favourite) {
        films.forEach(film => {
            if(film.favourite) checkGenres(film);
        })
    } else if (filters.best){
        films.forEach(film => {
            if(film.rating >= 8) checkGenres(film);
        })
    } else {
        films.forEach(film => checkGenres(film));
    }

    function checkGenres(film){
        filters.genres.forEach(genre => {
            if (film.genre == genre) filteredFilms.push(film);
        })
    }

    return filteredFilms;
}

function sortFilms(films, sort){
    switch (sort) {
        case "От высокой к низкой":
            films.sort((film1, film2) => film1.rating < film2.rating ? 1: -1);
            break;
        case "От низкой к высокой":
            films.sort((film1, film2) => film1.rating > film2.rating ? 1: -1);
            break;
        case "От а до я":
            films.sort((film1, film2) => film1.name > film2.name ? 1: -1);
            break;
        case "От я до а":
            films.sort((film1, film2) => film1.name < film2.name ? 1: -1);
            break;
        // case "Сначала новые":
            
        //     break;
        // case "Сначала старые":
            
        //     break;
        default:
            break;
    }
    return films;
}