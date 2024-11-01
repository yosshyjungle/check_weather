import React, {useState, useEffect} from 'react';
import '../src/index.css';
import { Footer, MainSection, OtherCitiesSection, Minipanel, FindForm } from './components';
import axios from 'axios';
import { CurrentWeather } from './components/type interfaces/weather_interface';
import { city_info,  } from './components/type interfaces/city';
import CreateMap from './components/Map/Map';
import { MapStats } from './components/Map/Map';
import Arrow from './components/icons/arrow';

function App() {
    const [city, setCity] = useState<string[]>(['Warsaw', 'Poland']);
    const [inputvalue, SetInputvalue] = useState<string>(city[0]);
    const [weather, setWeather] = useState<CurrentWeather>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userCityData, setUserCityData] = useState<city_info>();
    const [ErrorPanel, setErrorPanel] = useState<boolean>(false);
    const [position, setPosition] = useState<MapStats>({lon: 21.017532  , lat: 52.237049 } );
    
   useEffect(()=> {
     FindCity(city[0], 0)
    }, [])
   const getWeather = (lat:number, lon:number)=>{
    axios.get<CurrentWeather>('https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+ lon +'&hourly=temperature_2m,apparent_temperature,weathercode&current_weather=true&timezone=Europe%2FBerlin').then((resp)=>{
   /* console.log(resp.data.current_weather)  */
    setWeather(resp.data);
    setIsLoading(false);
      })
      
   };


   const handleSelectChange =(event: React.ChangeEvent<HTMLSelectElement>)=> {
   

   try { 
   switch(event.target.value){
    
    case '0': FindCity(inputvalue, 0)
    break;
    
    case '1': FindCity(inputvalue, 1)
    break;

    case '2': FindCity(inputvalue, 2)
    break;

    case '3': FindCity(inputvalue, 3)
    break;

    case '4': FindCity(inputvalue, 4)
    break;

    case '5': FindCity(inputvalue, 5)
    break;

   }
  } catch {
    console.log('error')
  }
}

   const handleInputChange = (event: { target: HTMLInputElement }) => {
        
    const  inpt_val   = event.target;
    SetInputvalue(inpt_val.value);
    
};
   const FindCity = async(cityname: string, num: number)=> {
    
    
    setIsLoading(true);

    try {
      axios.get<city_info>('https://geocoding-api.open-meteo.com/v1/search?name=' + cityname).then((resp)=>{
        if(resp.data.results)
        {
          setCity([resp.data.results[num].name, resp.data.results[num].country])
          getWeather(resp.data.results[num].latitude, resp.data.results[num].longitude)
          setUserCityData(resp.data);
          setErrorPanel(false);
          setPosition({lon: resp.data.results[num].longitude, lat: resp.data.results[num].latitude})
        }
        else {
          setErrorPanel(true);
        }
     })

     
    }
    catch {
      console.log('error');
      setIsLoading(true);
      
      
    }
   }
   const Option = (nmbr: number) =>{

    let x = "";
    if(userCityData?.results[nmbr]?.name != undefined)
    {
      x = userCityData?.results[nmbr]?.name + ", " + userCityData?.results[nmbr]?.admin1 + ", " + userCityData?.results[nmbr]?.country;

    } else {
      x="               "
    }
    return x;

   }

  

  return (
    <>
   
   <FindForm btn={() => FindCity(inputvalue, 0)}>
    <>
      <input className='peer text-2xl border-b-2 border-white w-9/12 bg-transparent text-white tablet:w-4/12' placeholder='Find your city:'  value={inputvalue} onChange={handleInputChange} list="cityname"></input>
    </>
   </FindForm>
   <div className='h-screen tablet:h-fit'>
    <div className='grid grid-cols-1 place-items-center w-full mx-auto '>
      <select id="Cities" name="Cities"  onChange={handleSelectChange} className='bg-transparent text-white text-1xl tablet:text-2xl'>
       <option value={0} className='text-black'>{Option(0)}</option> 
       <option value={1} className='text-black'>{Option(1)}</option> 
       <option value={2} className='text-black'>{Option(2)}</option>
       <option value={3} className='text-black'>{Option(3)}</option>
       <option value={4} className='text-black'>{Option(4)}</option>
       <option value={5} className='text-black'>{Option(5)}</option>
      </select>
     </div>
   <MainSection>
    <> 
     <Minipanel loading={isLoading} error={ErrorPanel}>
      <>
      <p className='text-4xl text-center text-yellow-200 font-Goldman tablet:text-2xl desktop:text-4xl'>City:</p>
      <p className='text-5xl text-center text-yellow-400 font-Goldman tablet:text-5xl desktop:text-6xl'>{city[0]} </p>
      <p className='text-4xl text-center text-yellow-400 font-Goldman tablet:text-3xl desktop:text-4xl'>{city[1]} </p>
      </>
     </Minipanel>

     <Minipanel loading={isLoading} error={ErrorPanel}>
      <>
      <p className='text-4xl text-center text-yellow-200 font-Goldman tablet:text-2xl desktop:text-4xl'>Temperature:</p><br/>
      <p className='text-7xl text-center text-yellow-400 font-Goldman tablet:text-5xl desktop:text-7xl'>{weather?.current_weather.temperature} °C</p>
      </>
     </Minipanel>

    <Minipanel loading={isLoading} error={ErrorPanel}>
      <>
      <p className='text-4xl text-center text-yellow-200 font-Goldman tablet:text-2xl desktop:text-4xl'>Windspeed:</p><br/>
      <p className='text-6xl text-center text-yellow-400 font-Goldman tablet:text-5xl desktop:text-6xl'>{weather?.current_weather.windspeed} km/h</p>
      </>
    </Minipanel>

   </>
  </MainSection>
  <div className='visible tablet:invisible' ><a href='#secondSection'><Arrow/></a></div>
 </div>
     <div className='hidden  desktop:flex '> 
       <CreateMap lon={position.lon} lat={position.lat} isLoad={isLoading}/>
    </div><br/>
    <div className="bg-slate-900 bg-opacity-70 h-full  tablet:h-fit"> 
       <div className='w-full py-2 h-2 bg-slate-700'> </div>
       <OtherCitiesSection/>
       <div className='w-full h-2 bg-slate-700'> </div>
   </div>
  
</>
  );
}

export default App;
