import { Component, OnInit } from "@angular/core";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder";
import * as ELG from "esri-leaflet-geocoder";

// import marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png"
});

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  marker;

  ngOnInit() {
    var map = L.map("map").setView([51.505, -0.09], 3);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const searchControl = new ELG.Geosearch();

    const results = new L.LayerGroup().addTo(map);

    searchControl
      .on("results", function (data) {
        results.clearLayers();
        for (let i = data.results.length - 1; i >= 0; i--) {
          results.addLayer(L.marker(data.results[i].latlng));
        }
      })
      .addTo(map);

    console.log(new ELG.ReverseGeocode());
    map.on("click", (e) => {
      new ELG.ReverseGeocode().latlng(e.latlng).run((error, result) => {
        if (error) {
          return;
        }
        if (this.marker && map.hasLayer(this.marker))
          map.removeLayer(this.marker);

        this.marker = L.marker(result.latlng)
          .addTo(map)
          .bindPopup(result.address.Match_addr)
          .openPopup();
      });
    });
  }
}
