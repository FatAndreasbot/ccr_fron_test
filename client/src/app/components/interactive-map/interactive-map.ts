import { AfterViewInit, ApplicationRef, Component, createComponent, Injector } from '@angular/core';
import * as L from 'leaflet'
import { PositionService } from '../../services/position-service/position-service';
import { MapPointForm } from '../map-point-form/map-point-form';

@Component({
  selector: 'app-interactive-map',
  imports: [],
  templateUrl: './interactive-map.html',
  styleUrl: './interactive-map.css',
})
export class InteractiveMap implements AfterViewInit {
  private map!: L.Map
  
  constructor(
    private positionService: PositionService,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  showPositionForm(latlng:L.LatLng){
    const container = document.createElement('div')

    const compRef = createComponent(MapPointForm, {environmentInjector: this.appRef.injector})

    this.appRef.attachView(compRef.hostView)
    container.appendChild((compRef.hostView as any).rootNodes[0])

    const icon = L.divIcon({
      html: container,
      iconSize: [0, 0],
      iconAnchor: [75, 30]
    })

    const marker = L.marker(latlng, {icon:icon}).addTo(this.map)

    compRef.instance.pointdata = latlng
    compRef.instance.close = () => {
      this.map.removeLayer(marker)
      this.appRef.detachView(compRef.hostView)
      compRef.destroy()
    }
    compRef.instance.afterSavePoint = () => {
      L.marker(latlng)
        .bindTooltip(compRef.instance.pointName, {permanent:false})
        .addTo(this.map)
    }
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [56, 92.9],
      zoom: 12
    })

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

    tiles.addTo(this.map)

    this.positionService.getAllPoints().subscribe((positions) => {
      positions.forEach((pos, i, arr) => {
        L.marker([pos.latitude, pos.longitude])
          .bindTooltip(pos.name, { permanent: false })
          .addTo(this.map)
      })
    })

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const target = e.originalEvent.target as HTMLElement

      if (target.closest('.form-container')){
        return
      }

      this.showPositionForm(e.latlng)
    })
  }
}
