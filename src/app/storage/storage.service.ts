import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private configPath = '/restaurant/config';
  myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  newConfig = {id: 1, maxStorageVolume: 0};
  public refreshUsedStorage$ = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  getMaxStorageVolume(): Observable<RestaurantConfig> {
    return this.http.get<RestaurantConfig>(this.configPath, {headers: this.myHeaders});
  }

  setMaxStorageVolume(volume: number): Observable<{}> {
    this.newConfig.maxStorageVolume = volume;
    return this.http.put(this.configPath, JSON.stringify(this.newConfig), {headers: this.myHeaders});
  }
}

export interface RestaurantConfig {
  id: number;
  maxStorageVolume: number;
}
