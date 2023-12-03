  const searchInput = document.getElementById('placeInput');
  const searchWrapper = document.querySelector('.wrapper');
  const resultsWrapper = document.querySelector('.results');
  
  document.body.addEventListener('click', function (event) {
    
    console.log("clicked on:",event.target);
    // Check if the clicked element is not the input or the result div
    if (event.target !== searchInput && !resultsWrapper.contains(event.target)) {
        // Remove the 'show' class
        console.log("clicked outside");
        searchWrapper.classList.remove('show');
        changeSearchBarStyle(0);
    }
});

  searchInput.addEventListener('keyup', () => {
    const apiKey = 'R0y4Ii1cgFOfg6wpsjBVRqywDLthrC60';

    // Attach an event listener to the input field
    var enterVal=document.querySelector("#placeInput").value;

    //-------changing search bar style------------
    if(enterVal)
    {
        changeSearchBarStyle(1);
    }
    else{
        changeSearchBarStyle(0);
    }
    //searchbar style changed------------

    // Call the AccuWeather API for autocomplete suggestions
    $.ajax({
        url: 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete',
        data: {
            apikey: apiKey,
            q: enterVal
        },
        success: function (data) {
            console.log(data);
            // Extract names from the API response
            const suggestions = data.map(city => {
                var state=city.AdministrativeArea.LocalizedName;
                var country=city.Country.LocalizedName;
                var city=city.LocalizedName;
                var name=city+", "+state+", "+country;
                return name;
            });
            console.log(suggestions);
            renderResults(suggestions,data);
        }
    });
  });
  
function changeSearchBarStyle(flag){
    var searchButton=document.querySelector("#Search-button");

    if(flag){
        searchInput.style.borderRadius="15px 0 0 0";
        searchButton.style.borderRadius="0 15px 0 0 ";
    }
    else{
        searchInput.style.borderRadius="15px 0 0 15px";
        searchButton.style.borderRadius="0 15px 15px 0 ";
    }
}

  function renderResults(results, allData) {
    if (!results.length) {
        return searchWrapper.classList.remove('show');
    }

    const content = results
        .map((item, index) => {
            return `<li data-index="${index}">${item}</li>`;
        })
        .join('');

    searchWrapper.classList.add('show');
    resultsWrapper.innerHTML = `<ul>${content}</ul>`;

    // Add event listener to each li element
    const liElements = document.querySelectorAll('.results li');
    liElements.forEach((li) => {
        li.addEventListener('click',(event) => handleLiClick(event, allData));
    });
}

function handleLiClick(event,data) {
    console.log("li click data", data);
    
    searchInput.value = '';
    changeSearchBarStyle(0);
    
    const selectedIndex = event.currentTarget.getAttribute('data-index');
    
    var place=data[selectedIndex].LocalizedName;
    var placeName=document.querySelector("#place-name");
    placeName.innerHTML=capitalizeWords(place);

    // Get the key from the data object using the index
    const selectedKey = data[selectedIndex].Key;
    console.log("selectedKey: ",selectedKey);
    // Call the function getMainData with the selected key
    getAllData(selectedKey);
    // Remove class 'show' from searchWrapper
    searchWrapper.classList.remove('show');
    
}

  

////////////////////////////////////////------------------------------------------------------

function capitalizeWords(inputString) {
    if(!inputString) return;
    return inputString.replace(/\b\w/g, function(match) {
        return match.toUpperCase();
    });
}

function searchPlace(){
    var place=document.querySelector("#placeInput").value;
    var placeName=document.querySelector("#place-name");
    placeName.innerHTML=capitalizeWords(place);
    $.ajax({
        url: "http://api.openweathermap.org/geo/1.0/direct",
        data: {
            q: `${place}`,
            limit: 1,
            appid: "758bbe67b101dc00250122cab0ec4cdc"
        }
      }).done(function(data) {
        if(!data[0])
        {
            alert("please enter valid place name");
            return;
        }
            var placeName=document.querySelector("#place-name");
            placeName.innerHTML=capitalizeWords(place);
        console.log("received: ",data[0].lat);
        console.log("received: ",data[0].lon);
        getAllData(data[0].lat,data[0].lon);
      });
}

function getLocationKey(lati, long){
    lati=lati.toFixed(2);
    long=long.toFixed(2);
    console.log(lati," ", long)
    $.ajax({
        url:"http://dataservice.accuweather.com/locations/v1/cities/geoposition/search",
        // url:"http://dataservice.accuweather.com/forecasts/v1/minute",
        data:{
            q:`${lati}, ${long}`,
            apikey: "R0y4Ii1cgFOfg6wpsjBVRqywDLthrC60",//for accuweather geoposition search
            // apikey: "4X35tx9ywfKmMIBBXniDmVz3hkCFJBx0",
            details: true
        }
    }).done(function(data){
        console.log(data);
        // console.log(data.Details.Key);
        key=data.Details.Key;
        getAllData(key);
    });
    }

function getAllData(key){
        $.ajax({
            url:`http://dataservice.accuweather.com/currentconditions/v1/${key}`,
            data:{
                apikey: "R0y4Ii1cgFOfg6wpsjBVRqywDLthrC60",
                details: true
            }
        }).done(function(data){
            console.log(data);
            setMainData(data);
            
        });
        //5 days forecast:
        $.ajax({
            url:`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}`,
            data:{
                apikey: "R0y4Ii1cgFOfg6wpsjBVRqywDLthrC60",
                details: true,
                metric: true
            }
        }).done(function(data){
            console.log("received forecast data:",data);
            setForecastData(data);
        });
}
    
function setMainData(data){
    console.log(data);
    var {
        Temperature: { Metric: { Value: temp }, Imperial: { Value: tempF } },
        RealFeelTemperatureShade: { Metric: { Value: feels_like } },
        Temperature: { Metric: { Value: temp_min } },
        Temperature: { Metric: { Value: temp_max } },
        RelativeHumidity: humidity,
        Wind: { Speed: { Metric: { Value: windSpeed } } },
        // Sunrise,
        // Sunset,
        WeatherIcon: iconNum,
        WeatherText: weatherMain
    } = data[0];
    
    var main_temp=document.querySelector("#main-temp");
    var humid=document.querySelector("#Humidity");
    var wind=document.querySelector("#wind");
    var temp_feel=document.querySelector("#feels-like");
    var weather_word=document.querySelector("#weather-word");
    var maxT=document.querySelector("#max_temp");
    var minT=document.querySelector("#min_temp");
    var icon=document.querySelector("#icon");

    icon.setAttribute('src', `./weather icons/${iconNum}-s.png`);
    temp=Math.round(temp);    
    main_temp.innerHTML=temp+"°C";
    humid.innerHTML="Humidity       "+humidity;
    wind.innerHTML="Wind speed      "+windSpeed;
    temp_feel.innerHTML="Feels like "+feels_like;
    weather_word.innerHTML=weatherMain;
    maxT.innerHTML="Max Temp       "+temp_max;
    minT.innerHTML="Min Temp       "+temp_min;

    // sunrise.innerHTML.concat=sunriseTime;
    // sunset.innerHTML.concat=sunsetTime;

}

function setForecastData(data){
    // console.log()
    var forecastRow=document.querySelector("#forecast-data");
    forecastRow.innerHTML="";

    const dailyForecasts = data.DailyForecasts;

    const weatherDetailsArray = dailyForecasts.map(day => ({
    date: day.Date,
    dayIcon: day.Day.Icon,
    temperature: {
        minimum: day.Temperature.Minimum.Value,
        maximum: day.Temperature.Maximum.Value,
    },
    dayShortPhrase: day.Day.ShortPhrase,
    airQuality: day.AirAndPollen.find(item => item.Name === "AirQuality").Category,
    realFeelTemperatureShade: day.RealFeelTemperatureShade.Maximum.Value,
    windSpeed: day.Day.Wind.Speed.Value,
    sunrise: day.Sun ? day.Sun.Rise : null,
    sunset: day.Sun ? day.Sun.Set : null,
    }));
    
    console.log(weatherDetailsArray);
    weatherDetailsArray.forEach((element, index) => {
        if(index===0){
            console.log("ind-0 ",element.date)
            // setSunData(element);
        }
        else{
            console.log(index," ",element.date);
            var dd=element.date;
            dd=dd.slice(8,10);
            var mm=element.date;
            mm=mm.slice(5,7);
            var yy=element.date;
            yy=yy.slice(0,4);
            var date=dd+"/"+mm+"/"+yy;
            

            var div1=document.createElement("div");
            if(index%2==0)
            div1.setAttribute("class","col pt-4 d-flex justify-content-center align-items-start FCcard");
            else
            div1.setAttribute("class","col pt-4 d-flex justify-content-center align-items-start");
            
            var div2=document.createElement("div");
            var forecastImg=document.createElement("img");
            forecastImg.setAttribute("src",`./weather icons/${element.dayIcon}-s.png`);
            forecastImg.setAttribute("class","mt-2 FCicon")
            
            var max_min=document.createElement("h3");
            max_min.setAttribute("class","fw-bold mb-4 fs-3 text-body-emphasis");
            max_min.innerHTML=`${element.temperature.maximum}°c / ${element.temperature.minimum}°c`;
            var p1=document.createElement("p");
            var p2=document.createElement("p");
            var p3=document.createElement("p");
            var p4=document.createElement("p");
            var p5=document.createElement("p");
            p1.innerHTML=element.dayShortPhrase;
            p2.innerHTML="On "+date;
            p3.innerHTML="Feels like "+element.realFeelTemperatureShade;
            p4.innerHTML="Air Quality "+element.airQuality;
            p5.innerHTML="Wind "+element.windSpeed+"km/h";

            div2.appendChild(max_min);
            div2.appendChild(p2);
            div2.appendChild(forecastImg);
            div2.appendChild(p1);
            div2.appendChild(p3);
            div2.appendChild(p4);
            div2.appendChild(p5);
            div1.appendChild(div2);
            forecastRow.appendChild(div1);


        }
    });
}


////remaining:
// 1. search dropdown
// 2. weather word icon
// 3. 5 days future forecast
// 4. designs:
//     4.1 top bar- push 'todays weather' and search box to other ends of the screen
//     4.2 background color as per weather 
//     4.3 max temp min temp in 1 row 
//     4.4 put humidity and all in 1 column and all data in another column
// 5. split getalldata funn in 2 one will send location key and other will receive the key and do further
//    process
// 6. when click on li element:
//      1. empty the search input box
//      2. retrive the location key and send to other funciton from getalldata
//      3. remove show class from result div
// 7. when suggestion box has show class and somewhere outside it is clicked it should disappear
// 8. when show class is appended search placeInput and searchButton borderRadius changes as well as when its removed.
// 9. place name not changing