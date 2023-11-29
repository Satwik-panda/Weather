function searchPlace(){
    var place=document.querySelector("#placeInput").value;
    $.ajax({
        url: "http://api.openweathermap.org/geo/1.0/direct",
        data: {
            q: `${place}`,
            limit: 1,
            appid: "758bbe67b101dc00250122cab0ec4cdc"
        }
      }).done(function(data) {
        if(!data[0])
            alert("please enter valid place name")
        console.log("received: ",data[0].lat);
        console.log("received: ",data[0].lon);
        getAllData(data[0].lat,data[0].lon);
      });
}

function getAllData(lati, long){
    lati=lati.toFixed(2);
    long=long.toFixed(2);
    console.log(lati," ", long)
    $.ajax({
        url:"http://dataservice.accuweather.com/locations/v1/cities/geoposition/search",
        data:{
            q:`${lati}, ${long}`,
            apikey: "R0y4Ii1cgFOfg6wpsjBVRqywDLthrC60",
            details: true
        }
    }).done(function(data){
        // console.log(data);
        // console.log(data.Details.Key);
        key=data.Details.Key;
        $.ajax({
            url:`http://dataservice.accuweather.com/currentconditions/v1/${key}`,
            data:{
                apikey: "R0y4Ii1cgFOfg6wpsjBVRqywDLthrC60",
                details: true
            }
        }).done(function(data){
            console.log(data);
            setAllData(data);
            
        })
    })
    //5 days forecast:
    $.ajax({
        url:"https://api.openweathermap.org/data/2.5/forecast",
        data:{
            lat:`${lati}`,
            lon:`${long}`,
            appid: "758bbe67b101dc00250122cab0ec4cdc"
        }
    }).done(function(data){
        console.log("\n",data);
    })
}
    
function setAllData(data){
    const {
        Temperature: { Metric: { Value: temp }, Imperial: { Value: tempF } },
        RealFeelTemperature: { Metric: { Value: feels_like } },
        Temperature: { Metric: { Value: temp_min } },
        Temperature: { Metric: { Value: temp_max } },
        RelativeHumidity: humidity,
        Wind: { Speed: { Metric: { Value: windSpeed } } },
        // Sunrise,
        // Sunset,
        WeatherIcon: iconNum,
        WeatherText: weatherMain
    } = data[0];
    
    // Converting epoch time to human-readable time (you can use your function here)
    // const sunriseTime = new Date(Sunrise * 1000).toLocaleTimeString();
    // const sunsetTime = new Date(Sunset * 1000).toLocaleTimeString();
    
    // Logging the values
    // console.log("Temperature:", temp, "°C");
    // console.log("Feels Like:", feels_like, "°C");
    // console.log("Min Temperature:", temp_min, "°C");
    // console.log("Max Temperature:", temp_max, "°C");
    // console.log("Humidity:", humidity, "%");
    // console.log("Wind Speed:", windSpeed, "km/h");

    // console.log("Sunrise:", sunriseTime);
    // console.log("Sunset:", sunsetTime);

    // console.log("Weather Main:", weatherMain);

    var main_temp=document.querySelector("#main-temp");
    var humid=document.querySelector("#Humidity");
    var wind=document.querySelector("#wind");
    var temp_feel=document.querySelector("#feels-like");
    var weather_word=document.querySelector("#weather-word");
    var maxT=document.querySelector("#max_temp");
    var minT=document.querySelector("#min_temp");

    // var sunrise=document.querySelector("#sunrise");
    // var sunset=document.querySelector("#sunset");

    main_temp.innerHTML=temp;
    humid.innerHTML="Humidity "+humidity;
    wind.innerHTML="Wind speed "+windSpeed;
    temp_feel.innerHTML="Feels like "+feels_like;
    weather_word.innerHTML=weatherMain;
    maxT.innerHTML="Max Temp: "+temp_max;
    minT.innerHTML="Min Temp: "+temp_min;

    // sunrise.innerHTML.concat=sunriseTime;
    // sunset.innerHTML.concat=sunsetTime;

}

function convertToIST(utcTime){
    const utcTimestamp = utcTime * 1000; // Example UTC timestamp

    // Convert UTC to IST
    const utcDate = new Date(utcTimestamp);
    const istDate = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata', // 'Asia/Kolkata' is the time zone for Indian Standard Time
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    }).format(utcDate);

    // console.log('UTC Time:', utcDate.toISOString());
    const istTime = istDate.slice(istDate.indexOf(' ') + 1); // Extract time part
    // console.log('IST Time (only):', istTime);
    // console.log('IST Time:', istDate);

    return istTime;
}