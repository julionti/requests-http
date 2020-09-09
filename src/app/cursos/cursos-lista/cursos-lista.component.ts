import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, EMPTY, Subject } from 'rxjs';
import { catchError, take, switchMap } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { CursosService } from './../cursos.service';
import { Curso } from './curso';
import { AlertModalComponent } from './../../shared/alert-modal/alert-modal.component';
import { AlertModalService } from './../../shared/alert-modal.service';
import { Cursos2Service } from '../cursos2.service';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {

  // cursos: Curso[];

  // bsModalRef: BsModalRef;

  deleteModalRef: BsModalRef; // para escutar o listener do madal de yes/no
  @ViewChild('deleteModal') deleteModal; // variavel do html

  cursos$: Observable<Curso[]>;

  error$ = new Subject<boolean>();

  cursoSelecionado: Curso;

  constructor(
    // private service: CursosService,
    private service: Cursos2Service,
    private modalService: BsModalService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
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
    // this.service.list()
    //   .pipe(
    //     // map(),
    //     // tap(),
    //     // switchMap()
    //     catchError(() => EMPTY)
    //   )
    //   .subscribe(
    //     dados => {
    //       console.log(dados); // 1-sucesso
    //     }
    //     // , error => console.error(error), // 2-erro de subscribe
    //     // () => console.log('Observable completo!') // 3-subscribe completo
    //   );
  }

  handleError() {
    // this.bsModalRef = this.modalService.show(AlertModalComponent);
    // this.bsModalRef.content.type = 'danger';
    // this.bsModalRef.content.message = 'Erro ao carregar cursos. Tente novamente mais tarde.';
    this.alertService.showAlertDanger('Erro ao carregar cursos. Tente novamente mais tarde.');
  }

  onEdit(id) {
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  onDelete(curso) {
    this.cursoSelecionado = curso;
    // this.deleteModalRef = this.modalService.show(this.deleteModal, { class: 'modal-sm' });
    const result$ = this.alertService.showConfirm('Confirmação', 'Tem certeza que deseja remover esse curso?');
    result$.asObservable().
      pipe(
        take(1),
        switchMap(result => result ? this.service.remove(curso.id) : EMPTY)
      )
      .subscribe(
        success => this.onRefresh(),
        error => this.alertService.showAlertDanger('Erro ao remover curso. Tente novamente mais tarde.')
      );
  }

  confirm(): void {
    this.service.remove(this.cursoSelecionado.id)
      .subscribe(
        success => this.onRefresh(),
        error => this.alertService.showAlertDanger('Erro ao remover curso. Tente novamente mais tarde.')
      );
    this.deleteModalRef.hide();
  }

  decline(): void {
    this.deleteModalRef.hide();
  }
}
