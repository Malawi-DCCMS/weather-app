import * as FileSystem from 'expo-file-system';
import {Asset} from "expo-asset"

type Position = {
  lat: number
  long: number
}

type Place = {
    position: Position
    name: string
}

export async function SnapToPlace(position: Position): Promise<Place|null> {
  let places: Place[]
  try {
    places = await Places()
  } catch(e){
      return null
  }
  if(! insideMalawi(position)){
    return null        
  }
  
  return closestPlace(places, position)
}

async function Places(): Promise<Place[]> {
    let places:Place[] = []

    const [{ localUri }] = await Asset.loadAsync(
        require("../assets/malawi_geonames.txt")
      );
    let rawPlaces = readGeonamesFile(localUri)

    ;(await rawPlaces).forEach((value) => {
        const place = placefromGeonameFormat(value)
        if (place) {
          places.push(place)
        }
    })

    return places
}

function placefromGeonameFormat(value:string): Place|null {
  const fields = value.split(/\t/)

  const lat = parseFloat(fields[4])
  const long = parseFloat(fields[5])

  // ignore place if lat or long could not be parsed into float.
  if (isNaN(lat) || isNaN(long) ) {
    return null
  }

  return { 
      position: {
        lat: parseFloat(fields[4]),
        long: parseFloat(fields[5]),
      },
      name: fields[1],
    }
}

async function readGeonamesFile(localUri: string):Promise<string[]> {
  try {
    const fileContent = await FileSystem.readAsStringAsync(localUri)
    return fileContent.split(/\r?\n/)
  }
  catch(e){
    alert("" + e)
  }
}

function closestPlace(places: Place[], position:Position): Place{
  let closest: [number, Place] | undefined

  places.forEach((place) => {
    const distance = calcDistance(position, place.position)

    if (typeof closest == "undefined"){
      closest = [distance, place]
    } else if(distance < closest[0]) {
      closest = [distance, place]
    }
  })

  return closest[1]
}


function calcDistance(point1:Position, point2:Position):number {
  let radlat1 = Math.PI * point1.lat/180
  let radlat2 = Math.PI * point2.lat/180
  let theta = point1.long-point2.long
  let radtheta = Math.PI * theta/180

  let dist = Math.sin(radlat1) * Math.sin(radlat2) + 
              Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344
  
  return dist
}


function insideMalawi(position:Position): boolean{
  // long downleft, lat downleft, long upperright, lat upperright
  const bbox = [32.6881653175, -16.8012997372, 35.7719047381, -9.23059905359]

  if(position.lat > bbox[1] && position.lat < bbox[3] &&
     position.long > bbox[0 && position.long < bbox[2]]){
      return true
     }

  return false
}