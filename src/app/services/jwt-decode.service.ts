import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtObject } from '../model/auth-object';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JwtDecodeService {
  decodeToken(token: string): JwtObject | null {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }
}
