import { Component, OnInit } from '@angular/core';
import { Observable, EMPTY, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { CursosService } from './../cursos.service';
import { Curso } from './curso';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {

  // cursos: Curso[];

  cursos$: Observable<Curso[]>;

  error$ = new Subject<boolean>();

  constructor(private service: CursosService) { }

  ngOnInit(): void {
    // this.service.list()
    // .subscribe(dados => this.cursos = dados); //trocar por async no ngfor e troca a var

    this.onRefresh();
  }

  onRefresh() {
    this.cursos$ = this.service.list()
      .pipe(
        catchError(error => {
          console.error(error);
          this.error$.next(true); // emite um valor true
          return EMPTY;
        })
      );

    // Outro forma de tratar erros com rxjs
    this.service.list()
      .pipe(
        // map(),
        // tap(),
        // switchMap()
        catchError(() => EMPTY)
      )
      .subscribe(
        dados => {
          console.log(dados); // 1-sucesso
        }
        // , error => console.error(error), // 2-erro de subscribe
        // () => console.log('Observable completo!') // 3-subscribe completo
      );
  }
}
