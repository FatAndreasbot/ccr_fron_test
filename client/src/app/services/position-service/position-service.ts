import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPosition } from '../../interfaces/iposition';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private endpointURL = "http://localhost:8000/api/position/"

  constructor(
    private http: HttpClient
  ) { }

  getAllPoints():Observable<IPosition[]>{
    return this.http.get<IPosition[]>(this.endpointURL)
  }

  savePoint(position:IPosition){
    return this.http.post(this.endpointURL, position)
  }
  
}
