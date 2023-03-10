import { Client, GeocodeResult, DistanceMatrixRow, TravelMode } from "@googlemaps/google-maps-services-js";
import config from "config/config"
import { GoogleMapsIntegrationError } from "errors/errors";

const KEY = config.GOOGLE_MAPS_API_KEY
const client = new Client({})

export class GoogleMapService {
  public static async geocode(address: string, key: string = KEY): Promise<GeocodeResult> {
    try {
      const { data: { results: [result] } } = await client.geocode({
        params: {
          key,
          address
        }
      })

      return result
    } catch(error) {
      throw error as GoogleMapsIntegrationError
    }
  }

  public static async distancesMatrix(
    { origins, destinations }: { [key: string]: string[] }, 
    key: string = KEY
    ): Promise<DistanceMatrixRow[]> {
    try{
      const { data: { rows } } = await client.distancematrix({ 
        params: { 
          key,
          origins,
          destinations,
          mode: TravelMode.driving
        } 
    })

      return rows
    } catch(error) {
      throw error as GoogleMapsIntegrationError
    }
  }
}
