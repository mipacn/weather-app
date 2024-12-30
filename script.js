let input = document.querySelector("input")
let system = document.querySelector(".system")
let temp = document.querySelector(".temperature")
let unit = document.querySelector(".unit")
let feeling = document.querySelector(".feeling")
let wind = document.querySelector(".wind")
let humidity = document.querySelector(".humidity")
let conditions = document.querySelector(".conditions")
let place = document.querySelector(".location")

system.addEventListener("click", () => {
	if (system.textContent === "Metric") {
		system.textContent = "Imperial"
		temp.textContent = Math.round((+temp.textContent - 32) / 1.8)
		unit.textContent = "ºC"
		let feelingSplit = feeling.textContent.split(": ")
		let feelingNumber = feelingSplit[1].split("º")[0]
		feeling.textContent = `FEELS LIKE: ${Math.round(
			(feelingNumber - 32) / 1.8
		)}ºC`
		let windSplit = wind.textContent.split(": ")
		let windNumber = windSplit[1].split("MP")[0]
		wind.textContent = `WIND: ${Math.round(windNumber * 1.61)} KMH`
	} else {
		system.textContent = "Metric"
		temp.textContent = Math.round(+temp.textContent * 1.8 + 32)
		unit.textContent = "ºF"
		let feelingSplit = feeling.textContent.split(": ")
		let feelingNumber = feelingSplit[1].split("º")[0]
		feeling.textContent = `FEELS LIKE: ${Math.round(
			feelingNumber * 1.8 + 32
		)}ºF`
		let windSplit = wind.textContent.split(": ")
		let windNumber = windSplit[1].split("KM")[0]
		wind.textContent = `WIND: ${Math.round(windNumber / 1.61)} MPH`
	}
})

async function getData(location) {
	let locationLower = location.toLowerCase()
	try {
		let data = await fetch(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationLower}?key=ETTSBF69MEFVNS46HJSD93QUW`,
			{ mode: "cors" }
		)
		let json = await data.json()
		let conditionsData = json.currentConditions.conditions
		let addressData = json.resolvedAddress.split(",")
		let countryData = addressData[addressData.length - 1].toUpperCase()
		let cityData = json.address.toUpperCase()
		let locationData = `${cityData}, ${countryData}`
		let tempData = Math.round(json.currentConditions.temp)
		let feelingData = Math.round(json.currentConditions.feelslike)
		let windData = Math.round(json.currentConditions.windspeed)
		let humidityData = Math.round(json.currentConditions.humidity)
		return {
			conditionsData,
			addressData,
			locationData,
			tempData,
			feelingData,
			windData,
			humidityData,
		}
	} catch {
		alert("No matching location found")
	}
}

input.addEventListener("keydown", async (event) => {
	if (event.key === "Enter") {
		if (system.textContent == "Metric") {
			let data = await getData(input.value)
			conditions.textContent = data.conditionsData
			place.textContent = data.locationData
			temp.textContent = Math.round(data.tempData)
			unit.textContent = "ºF"
			feeling.textContent = `FEELS LIKE: ${Math.round(data.feelingData)}ºF`
			wind.textContent = `WIND: ${Math.round(data.windData)}MPH`
			humidity.textContent = `HUMIDITY: ${Math.round(data.humidityData)}%`
			input.value = ""
		} else {
			let data = await getData(input.value)
			conditions.textContent = data.conditionsData
			place.textContent = data.locationData
			temp.textContent = Math.round((data.tempData - 32) * 1.8)
			unit.textContent = "ºC"
			feeling.textContent = `FEELS LIKE: ${Math.round(
				(data.feelingData - 32) * 1.8
			)}ºC`
			wind.textContent = `WIND: ${Math.round(data.windData / 1.6)}KMH`
			humidity.textContent = `HUMIDITY: ${Math.round(data.humidityData)}%`
			input.value = ""
		}
	}
})
