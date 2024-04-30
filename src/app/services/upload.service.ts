import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }
}
