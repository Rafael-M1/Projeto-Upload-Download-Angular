import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FileObject } from '../model/file';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

  getFiles() {
    return this.http.get<FileObject[]>(`${this.apiUrl}/files`);
  }

  deleteFile(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/files/${id}`);
  }

  downloadFile(id: number) {
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      responseType: 'blob',
    });
  }
}
