import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateUserDto, User } from '../models/user.model';

interface UserAuthResponse {
  data: User;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  // Busca un usuario por email — retorna 404 si no existe
  findByEmail(email: string): Observable<UserAuthResponse> {
    return this.http.get<UserAuthResponse>(
      `${this.apiUrl}?email=${encodeURIComponent(email)}`,
    );
  }

  // Registra un nuevo usuario con el email
  create(dto: CreateUserDto): Observable<UserAuthResponse> {
    return this.http.post<UserAuthResponse>(this.apiUrl, dto);
  }
}
