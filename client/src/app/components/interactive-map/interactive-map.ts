import { AfterViewInit, Component, signal, WritableSignal } from '@angular/core';
import * as L from 'leaflet'
import { IPosition } from '../../interfaces/iposition';
import { PositionService } from '../../services/position-service/position-service';

@Component({
  selector: 'app-interactive-map',
  imports: [],
  templateUrl: './interactive-map.html',
  styleUrl: './interactive-map.css',
})
export class InteractiveMap implements AfterViewInit {
  private map!: L.Map

  constructor(
    private positionService: PositionService
  ) { }

  ngOnInit() { 
    this.positionService.getAllPoints().subscribe((positions) => {
      positions.forEach((pos, i, arr) => {
        L.marker([pos.latitude, pos.longitude])
          .bindTooltip(pos.name, {permanent:false})
          .addTo(this.map)
      })
    })
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center:[56, 92.9],
      zoom:12
    })

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

    tiles.addTo(this.map)
  }
}
