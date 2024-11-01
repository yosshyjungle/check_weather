export interface CurrentWeather  {
    current_weather:CurrenWeatherData,
    
  }

  export interface CurrenWeatherData {
    temperature: number,
    time: string,
    weathercode: number,
    winddirection: number,
    windspeed: number
  }