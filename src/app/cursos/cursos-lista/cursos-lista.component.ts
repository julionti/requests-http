import { AlertModalService } from './../../shared/alert-modal.service';
import { Component, OnInit } from '@angular/core';
import { Observable, EMPTY, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { CursosService } from './../cursos.service';
import { Curso } from './curso';
import { AlertModalComponent } from './../../shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {

  // cursos: Curso[];

  // bsModalRef: BsModalRef;
  cursos$: Observable<Curso[]>;

  error$ = new Subject<boolean>();

  constructor(
    private service: CursosService,
    // private modalService: BsModalService
    private alertService: AlertModalService
  ) { }

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
          // this.error$.next(true); // emite um valor true
          this.handleError();
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

  handleError() {
    // this.bsModalRef = this.modalService.show(AlertModalComponent);
    // this.bsModalRef.content.type = 'danger';
    // this.bsModalRef.content.message = 'Erro ao carregar cursos. Tente novamente mais tarde.';
    this.alertService.showAlertDanger('Erro ao carregar cursos. Tente novamente mais tarde.');
  }
}
