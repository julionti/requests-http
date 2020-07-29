import { CursosService } from './../cursos.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Curso } from '../cursos-lista/curso';

@Injectable({
  providedIn: 'root'
})
export class CursoResolverGuard implements Resolve<Curso> {

  constructor(private service: CursosService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Curso> {
    if (route.params && route.params.id) {
      return this.service.loadById(route.params.id); // retorna um Observable de Curso
    }

    // novo curso
    return of({ // para manter mesmo tipo de retorno do loadById(Observable)
      id: null,
      nome: null
    });
  }

}
