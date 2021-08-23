import { getWeather } from "./weatherRetriver.js";
import { mainBurger } from "./hamburgare.js";

main();

function main() {
  mainBurger();
  getWeather().then(insertWeather);
}

function insertWeather(res) {
  //structure of the page
  let main = document.querySelector('main');
  let article = document.createElement('article');
  let s1 = document.createElement('section');
  let s2 = document.createElement('section');
  let h3 = document.createElement('h3');
  let h4_1 = document.createElement('h4');
  let h4_2 = document.createElement('h4');
  h3.innerHTML = 'Väder';
  h4_1.innerHTML = 'Idag';

  main.appendChild(article);
  article.appendChild(h3);
  article.appendChild(s1);
  article.appendChild(s2);
  s1.appendChild(h4_1);

  //adding class to be able to control style in css-file
  s1.classList.add('s5');
  s2.classList.add('s6');

  //creating the tabels 
  for (let i = 0; i < 2; i++) {
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tr1 = document.createElement('tr');
    let th1 = document.createElement('th');
    let th2 = document.createElement('th');
    let th3 = document.createElement('th');
    let th4 = document.createElement('th');

    th1.innerHTML = 'KL';
    th2.innerHTML = 'Temp';
    th3.innerHTML = 'Vind';
    th4.innerHTML = 'Himmel';

    let tbody = document.createElement('tbody');

    table.appendChild(thead);
    thead.appendChild(tr1);
    tr1.appendChild(th1);
    tr1.appendChild(th2);
    tr1.appendChild(th3);
    tr1.appendChild(th4);

    table.appendChild(tbody);

    if (i == 0) {
      s1.appendChild(table);
      h4_2.innerHTML = 'Imorgon';
      s2.appendChild(h4_2);
    }
    if (i == 1) {
      s2.appendChild(table);
    }

    //Adding class/id to be able to give specific layout in css-file
    table.classList.add('weather_table');
    thead.classList.add('weather_thead');
    tbody.classList.add('weather_body');
    tr1.setAttribute('id', 'weather_tr');
    th1.setAttribute('id', 'time');
    th2.setAttribute('id', 'temp');
    th3.setAttribute('id', 'wind');
    th4.setAttribute('id', 'cloud');

    //Need to keep track of the times that will be presented
    var currentdate = new Date(); 
    var day_6 = currentdate.getFullYear()  + '-0' + 
    (currentdate.getMonth()+1)  + '-' + (currentdate.getDate()+i) 
    + 'T'  + '06:00:00Z';

    var day_12 = currentdate.getFullYear()  + '-0' + 
    (currentdate.getMonth()+1)  + '-' + (currentdate.getDate()+i) 
    + 'T'  + '12:00:00Z';

    var day_18 = currentdate.getFullYear()  + '-0' + 
    (currentdate.getMonth()+1)  + '-' + (currentdate.getDate()+i) 
    + 'T'  + '18:00:00Z';


    //creating cells and inserting data
    for (let j = 0; j < 3; j++) {
      let tr2 = document.createElement('tr');
      let td1 = document.createElement('td');
      td1.innerHTML = 6 + (j * 6);

      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var td4 = document.createElement('td');

      //Adding class/id to be able to give specific layout in css-file
      tr2.setAttribute('id', 'weather_tr');
      td1.setAttribute('id', 'time');
      td2.setAttribute('id', 'temp');
      td3.setAttribute('id', 'wind');
      td4.setAttribute('id', 'cloud');

      tbody.appendChild(tr2);
      tr2.appendChild(td1);
      tr2.appendChild(td2);
      tr2.appendChild(td3);
      tr2.appendChild(td4);

      //Pick up an array of all relevant data
      let temps = findTemps(res);
      let winds = findWindS(res);
      let directions = findDirection(res);
      let clouds = findCloud(res); 

      //Counts which position in the timeSeries-array that the specific day and time is positioned 
      let number = new Array();
      if(j == 0) {
        number = getTimeSerie(res, day_6);
      }else if(j == 1) {
        number = getTimeSerie(res, day_12);
      }else if(j == 2) {
        number = getTimeSerie(res, day_18);
      }

      //Makes sure that only information that is available is posted
      if (number.length != 0) {
        td2.innerHTML = temps[number.length-1].values + ' ';
      
        let wind = ' (' + winds[number.length-1].values + ')';
        let degree = directions[number.length-1].values;
        td3.innerHTML = "<img id=\"arrow\" src=\"../images/small/arrow_small.svg\" width=\"32\" height=\"32\">" + wind;
        document.querySelector("#arrow").style.transform = "rotate("+ degree +"deg)";
    
        var cloud = cloudReader(clouds[number.length-1].values);
        td4.innerHTML = cloud;
      }else {
        //If no data about the current time exists
        td2.innerHTML = 'N/A';
        td3.innerHTML = 'N/A';
        td4.innerHTML = 'N/A';
      }
    }
  }
}

//Translating the numbervalue into a description of the current cloud-situation
function cloudReader(ws) {
  let text;
  switch(parseInt(ws)) {
    case 1:
      text = 'Klar himmel';
      break;
    case 2:
      text = 'Nästan klar himmel';
      break;
    case 3:
      text = 'Enstaka moln';
      break;
    case 4:
      text = 'Halv-klart';
      break;
    case 5:
      text = 'Molnigt';
      break;
    case 6:
      text = "Mulet";
      break;
    case 7:
      text = "Dimma";
      break;
    default:
      text = 'Regn eller snö';
  }
  return text;
}

function findTemps(res){
  let temps = new Array();

  res.timeSeries.forEach(function(obj, x) {
    obj.parameters.forEach(function(obj, i) {
      if(obj.unit == 'Cel'){
      temps[x] = obj;
      } 
    })
  });
  return temps;
}

function findWindS(res){
  let windS = new Array();

  res.timeSeries.forEach(function(obj, x) {
    obj.parameters.forEach(function(obj) {
      if(obj.name == 'ws'){
        windS[x] = obj;
      }
    })
  });
  return windS;
}

function findDirection(res){
  let directions = new Array();

  res.timeSeries.forEach(function(obj, x) {
    obj.parameters.forEach(function(obj) {
      if(obj.name == 'wd'){
        directions[x] = obj;
      }
    })
  });
  return directions;
}

function findCloud(res){
  let clouds = new Array();

  res.timeSeries.forEach(function(obj, x) {
    obj.parameters.forEach(function(obj) {
      if(obj.name == 'Wsymb2'){
        clouds[x] = obj;
      }
    })
  });
  return clouds;
}

function getTimeSerie(res, str){
  let n = new Array();

  res.timeSeries.forEach(function(obj, x) {
    if(obj.validTime == str){
      n[x] = obj;
    }
  });

  return n;
}