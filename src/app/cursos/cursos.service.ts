import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, delay, take } from 'rxjs/operators';

import { Curso } from './cursos-lista/curso';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  private readonly API = `${environment.API}cursos`;

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Curso[]>(this.API)
      .pipe(
        delay(2000),
        tap(console.log)
      );
  }

  loadById(id) {
    return this.http.get<Curso>(`${this.API}/${id}`).pipe(take(1)); // para não precisar de unsubscribe
  }

  private create(curso: Curso) {
    return this.http.post(this.API, curso).pipe(take(1));
  }

  private update(curso: Curso) {
    return this.http.put(`${this.API}/${curso.id}`, curso).pipe(take(1));
  }

  save(curso) {
    if (curso.id) {
      return this.update(curso);
    }
    return this.create(curso);
  }

  remove(id) {
    return this.http.delete(`${this.API}/${id}`).pipe(take(1));
  }
}
