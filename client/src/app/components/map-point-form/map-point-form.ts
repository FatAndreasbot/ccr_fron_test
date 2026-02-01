import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LatLng } from 'leaflet';
import { PositionService } from '../../services/position-service/position-service';
import { IPosition } from '../../interfaces/iposition';

@Component({
  selector: 'app-map-point-form',
  imports: [FormsModule],
  templateUrl: './map-point-form.html',
  styleUrl: './map-point-form.css',
})
export class MapPointForm {
  delete: (() => void) | null = null;
  afterSavePoint: (() => void) | null = null
  pointdata: LatLng | null = null
  pointName:string = ""

  constructor(
      private positionService: PositionService,
  ) { }

  savePoint(){
    if (this.pointdata === null){
      throw new Error("no position data were given")
    }

    const postion: IPosition = {
      name: this.pointName,
      latitude: this.pointdata.lat,
      longitude: this.pointdata.lng
    }

    this.positionService.savePoint(postion).subscribe({
      next:(resp) => {
        if (this.afterSavePoint !== null){
          this.afterSavePoint()
        }
        this.close()
      }
    })
  }

  close() {
    if (this.delete === null) {
      throw new Error("delete function was not set")
    }
    this.delete()
  }
}
