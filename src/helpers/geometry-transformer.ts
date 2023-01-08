import {  Geometry, Point } from "geojson";
import { ValueTransformer } from "typeorm";
import wkx from "wkx";


export class GeometryTransformer implements ValueTransformer {
  public to(geojson: Geometry) {
    geojson.type = "Point"

    return wkx.Geometry.parseGeoJSON(geojson).toGeoJSON();
  }

  public from(wkb: Point) {
    return wkb;
  }
}
