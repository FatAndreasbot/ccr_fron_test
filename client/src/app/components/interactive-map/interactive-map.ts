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
  points: WritableSignal<IPosition[]> = signal([])

  constructor(
    private positionService: PositionService
  ) { }

  ngOnInit() { 
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center:[56, 92.9],
      zoom:3
    })

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 12,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

    tiles.addTo(this.map)
  }
}
