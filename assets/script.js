const city_name = $('#cityName');
const city_temp = $('#cityTemp');
const city_humidity = $('#cityHumidity');
const city_wind = $('#cityWind');
const city_UV = $('#cityUV');
const forecast = $('.forecast');
const listGroup = $('.listgroup');


const allCities = JSON.parse(localStorage.getItem('allCities')) || [];

$(document).ready(() => {

  allCities.forEach((city) => {
    listGroup.prepend(
      $(`<li class="listgroup">${city}</li>`)
    );
  });
  const city = 'New York';
  currentWeather(city);
  getFutureWeather(city);

  $('.listgroup').on('click', (e) => {
    const city = e.target.textContent;
    currentWeather(city);
    getFutureWeather(city);
  });
});

$('form').on('submit', (e) => {
  e.preventDefault();
  const city = $('input').val();
  allCities.push(city);

  localStorage.setItem('allCities', JSON.stringify(allCities));

  listGroup.prepend($(`<li class="listgroup">${city}</li>`));

  $('.listgroup').on('click', (e) => {
    const city = e.target.textContent;
    getCurrentWeather(city);
    getFutureWeather(city);
  });

  currentWeather(city);
  getFutureWeather(city);
});

function currentWeather(city) {
  let baseURL =
    'https://api.openweathermap.org/data/2.5/weather?appid=5060201c511bb9fb7059c19638ab42e9&units=imperial';
  $.ajax({
    url: baseURL + `&q=${city}`,
    method: 'GET',
  }).then((res) => {

    const unix_timestamp = res.dt;
    const date = new Date(unix_timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formatedTime = `${month}/${day}/${year}`;

    city_name.text(res.name + ' ' + formatedTime);
    city_temp.text('Temperature ' + res.main.temp + '℉');
    city_humidity.text('Humidity ' + res.main.humidity + '%');
    city_wind.text('Wind Speed ' + res.wind.speed + 'MBH');
    city_name.append(
      $(
        `<img src="https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png"></img>`
      )
    );

    const lat = res.coord.lat;
    const lon = res.coord.lon;

    $.ajax({
      url: ` https://api.openweathermap.org/data/2.5/uvi?appid=5060201c511bb9fb7059c19638ab42e9&units=imperial&lat=${lat}&lon=${lon}`,
      method: 'GET',
    }).then((res) =>
      city_UV.html(
        `UV index <span class="text-white p-1 ${res.value < 2
          ? 'bg-sucess'
          : res.value <= 7
            ? 'bg-warning'
            : 'bg-danger'
        }">${res.value}</span>`
      )
    );
  });
}

function getFutureWeather(city) {
  let baseURL =
    'https://api.openweathermap.org/data/2.5/forecast?appid=5060201c511bb9fb7059c19638ab42e9&units=imperial';
  $.ajax({
    url: baseURL + `&q=${city}`,
    method: 'GET',
  }).then((res) => {

    const futureWeather = [];
    for (let i = 4; i < res.list.length; i += 8) {
      futureWeather.push(res.list[i]);
    }

    forecast.empty();

    futureWeather.forEach((day) => {
      const cards = $('<div>').addClass('card col-sm-4 col-md-2 bg-primary text-white');

      cards.html(`<div class="card-body"> ${day.dt_txt.slice(0, 10)}
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"></img>
      <p class="card-text">Temp: ${day.main.temp}℉</p>
      <p class="card-text">Humidity: ${day.main.humidity}%</p>
        `);

      forecast.append(cards);
    });
  });
}