'use strict';

function getZero(timeNum){
	if (timeNum < 10 && timeNum >= 0){
		return `0${timeNum}`;
	} else {
		return timeNum;
	}
}

function setDate(timestamp) {

	const time = new Date(timestamp);
	const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				dayOfTheWeek = time.getDay(),
				hours = getZero(time.getHours()),
				minutes = getZero(time.getMinutes());

	return(`${weekDays[dayOfTheWeek]} ${hours}:${minutes}`);
}

function getForecast(coordinates){
	let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
	axios.get(apiUrl).then(displayForecast);
}

function getResponseWithCurrentTemp(currUrl){
	axios.get(currUrl).then((response) => {
		if (response.request.status === 200) {
			celsiusTemp = response.data.main.temp;
			const temperature = document.querySelector("#current_temperature");
			const humidity = document.querySelector("#humidity");
			const wind = document.querySelector("#wind");
			const statusWeather = document.querySelector("#status_weather");
			const currentDataTime = document.querySelector("#data_time");
			const icon = document.querySelector("#icon");
			icon.setAttribute("src", `icons/${response.data.weather[0].icon}.svg`);
			icon.setAttribute("alt", `${response.data.weather[0].description}`);

			currentDataTime.innerHTML = setDate(response.data.dt * 1000);
			temperature.innerHTML = Math.round(celsiusTemp);
			humidity.innerHTML = response.data.main.humidity;
			wind.innerHTML = Math.round(Number(response.data.wind.speed) * 3.6);
			statusWeather.innerHTML = response.data.weather[0].description;

			let country = response.data.sys.country;
			let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
			h1City.innerHTML = `${response.data.name}, ${regionNames.of(country)}`;

			getForecast(response.data.coord);
		} 
	});
}

function findPosition(position){
	const homeButton = document.querySelector("#home_button");
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

	homeButton.addEventListener("click", (event) => {
		event.preventDefault();
		getResponseWithCurrentTemp(apiUrl);
	});
}

function showSearchedCity(city){
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	getResponseWithCurrentTemp(apiUrl);
	searchingCity.value = '';
}

const apiKey = "1a393094c95cd8490917aab767379862",
			searchingCity = document.querySelector(".form_input"),
			searchCityButton = document.querySelector("form"),
			h1City = document.querySelector("h1"),
			defaultCity = "Kyiv";

let celsiusTemp;


showSearchedCity(defaultCity);
navigator.geolocation.getCurrentPosition(findPosition);

searchCityButton.addEventListener("submit", (event) => {
	event.preventDefault();
	if (searchingCity.value !== '') {
		showSearchedCity(searchingCity.value);
	}
});

function formateDay(timestamp){
	const date = new Date(timestamp * 1000);
	const day = date.getDay();
	const forecastWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return forecastWeek[day];
}

function displayForecast(response){
	const forecast = response.data.daily;
	const current = response.data.current;
	const forecastElement = document.querySelector("#forecast");
	const uvIndex = document.querySelector("#uv_index");
	const maxUvIndex = document.querySelector("#max_uv_index");
	const maxTemp = document.querySelector("#max_t");
	const minTemp = document.querySelector("#min_t");
	const precipitation = document.querySelector("#precipitation");

	let forecastHTML = `<div class="row">`;
	forecast.forEach((day, index) => {

		if (index === 0){
			if (Math.round(current.uvi) === 0){
				uvIndex.innerHTML = `<i class="fa-solid fa-0"></i>`;
			} else {
				uvIndex.innerHTML = `<img src="icons/extra icons/uv-index-${Math.round(current.uvi)}.svg" alt="uv index ${current.uvi}">`;
			}
			maxUvIndex.innerHTML = `<img src="icons/extra icons/uv-index-${Math.round(day.uvi)}.svg" alt="uv index ${day.uvi}">`;
			precipitation.innerHTML = parseInt(day.pop * 100);
			maxTemp.innerHTML = Math.round(day.temp.max);
			minTemp.innerHTML = Math.round(day.temp.min);
		}
		if (index > 0 && index < 6){
		forecastHTML +=
		`<div class="col-2 current_info forecast_week_day pt-2 pb-2">
			${formateDay(day.dt)}
			<img src="icons/${day.weather[0].icon}.svg" alt="${day.weather[0].description}">
			<div class="forecast_temperature row">
				<span>&#9650; ${Math.round(day.temp.max)}°</span>
				<span>&#9660; ${Math.round(day.temp.min)}°</span>
			</div>
		</div>`;
		}
	});

	forecastHTML = forecastHTML + `</div>`;
	forecastElement.innerHTML = forecastHTML;
}