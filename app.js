import React from 'react'

let WeatherIcon = ({icon}) => {
	let imageSrc = `http://openweathermap.org/img/w/${icon}.png`
	return <img className="weather_icon" src={imageSrc}/>
}
let APPID = "41506895ac03575162719df15d34ce42"
let KELVIN = 273.15
class WeatherItem extends Object {
	constructor(params) {
		super()
		let dateParts = params.dt_txt.split(" ")
		this.date = dateParts[0]
		this.time = dateParts[1]
		this.icon = params.weather[0].icon,
		this.condition = {
			weather: params.weather[0].main,
			description: params.weather[0].description,
			temperature: Math.round(params.main.temp - KELVIN)
		}
	}
}
export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.state =  {
			currentCity: "London",
			currentCountry: "UK",
			weatherObject: {},
			days:[],
			currentWeatherItem: {},
			currentIndex:0,
			isLoading: true
		}
	}
	parseData(response) {
		let jsonResponse = JSON.parse(response.responseText)
		let days = []
		let currentWeatherItem = new WeatherItem(jsonResponse.list[0])
		let newWeatherObject = jsonResponse.list.reduce((accumulator, current) => {
			let day = current.dt_txt.split(" ")[0]
			let weatherItem = new WeatherItem(current)
			if (accumulator[day]) {
				accumulator[day].push(weatherItem)
			} else {
				accumulator[day] = [weatherItem]
				days.push(day)
			}
			return accumulator
		}, {})
		let currentDay = days[0]
		this.setState({weatherObject: newWeatherObject, days, currentWeatherItem, currentDay, isLoading:false})
	}
	fetchWeather() {
		let {currentCity, currentCountry} = this.state
		let url =  `http://api.openweathermap.org/data/2.5/forecast?q=${currentCity},${currentCountry}&mode=json&appid=${APPID}`
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", this.parseData.bind(this, oReq));
		oReq.open("GET", url);
		oReq.send();
	}
	componentDidMount() {
		this.fetchWeather()	
	}
	setWeatherPanel(currentDay, currentIndex) {
		this.setState({currentDay, currentIndex})
	}
	slideMoved(e) {
		let currentIndex = parseInt(e.target.value)
		this.setState({currentIndex})
	}
	render() {
		let {currentCity, currentCountry, weatherObject, days, currentDay, currentIndex, isLoading} = this.state
		return (isLoading ? <div>Loading</div>:
			<div className="app">
				<h2>Weather for {currentCity}, {currentCountry}</h2>
				<div>
				</div>
				<WeatherDashboard weather={weatherObject[currentDay][currentIndex]}/>
				<div className="slider">
					<input  style={{visibility: (weatherObject[currentDay].length > 1) ? "visible": "hidden"}} type="range" min={0} value={currentIndex} onChange={this.slideMoved.bind(this)} max={weatherObject[currentDay].length-1} step="1"/>
				</div>
				<div className="weather_panel">
				{days.map((day) => {
					let weatherItem = weatherObject[day][0]
					return <WeatherPanel key={day} handleClick={this.setWeatherPanel.bind(this, day, 0)} day={day}/>
				})}
				</div>
				<h2></h2>
			</div>
			)
	}
}
var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
class WeatherPanel extends React.Component {
	constructor() {
		super()
	}
	render() {
		let {day, handleClick}  = this.props
		let date = new Date(day)
		return (<div onClick={handleClick} className="weather_panel_item">
			<p className="panel_day">{DAYS[date.getDay()]}</p>
			<p className="panel_day">{date.getDate()} {MONTHS[date.getMonth()]}</p>
		</div>)
	}
}
class WeatherDashboard extends React.Component {
	constructor() {
		super()
	}
	render() {
		let {weather={}} = this.props
		let {condition={}} = weather
		let date = new Date(weather.date)
		let [hours, minutes, _] = weather.time.split(":")
		let suffix = hours >= 12 ? "pm" : "am"
		hours = hours%12
		hours = !parseInt(hours) ? 12 : hours
		return <div className="weather_dashboard">
			<div className="dashboard_panel">
				<p className="dashboard_header">Condition</p>
				<WeatherIcon icon={weather.icon} />
				<br />
				<h3 className="condition dashboard_text">{condition.weather}</h3>
			</div>
			<div className="dashboard_panel">
				<p className="dashboard_header">Temperature</p>
				<h2 className="dashboard_text">{condition.temperature}&deg;C</h2>
			</div>
				<br style={{clear:"both"}}/>
			<div className="dashboard_panel">
				<p className="dashboard_header">Time</p>
					<p className="dashboard_text">{DAYS[date.getDay()]} {date.getDate()} {MONTHS[date.getMonth()]}</p>
				<h2 className="dashboard_text">{hours}{suffix}
			</h2>
			</div>
		</div>
	}
}