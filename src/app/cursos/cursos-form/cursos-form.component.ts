import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { AlertModalService } from './../../shared/alert-modal.service';
import { CursosService } from './../cursos.service';
import { map, switchMap } from 'rxjs/operators';
import { Cursos2Service } from '../cursos2.service';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.scss']
})
export class CursosFormComponent implements OnInit {

  form: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder,
    // private service: CursosService,
              private service: Cursos2Service,
              private modal: AlertModalService,
              private location: Location,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // let registro = null;

    // this.route.params.subscribe(
    //   (params: any) => {
    //     const id = params.id;
    //     console.log(id);
    //     const curso$ = this.service.loadById(id);
    //     curso$.subscribe(curso => {
    //       registro = curso;
    //       this.updateForm(curso);
    //     });

    //     console.log(registro); // pode estar nulo pois o subscribe ainda não foi concluído
    //   }
    // );

    // this.route.params // unsubscribe automatico
    //   .pipe(
    //     map((params: any) => params.id), // recebe o params e retorna o id
    //     switchMap(id => this.service.loadById(id)) // precisa retornar um observable, devolve o valor do último pedido e o take
    //     // switchMap(cursos => obterAulas)
    //     // concatMap a ordem da requisição importa
    //     // mergeMap  a ordem da requisição NÃO importa
    //     // exaustMap casos de login (só processa a proxima req após receber a resposta da anterior)
    //   )
    //   .subscribe(curso => this.updateForm(curso)); // retornado pelo switchmap

    const curso = this.route.snapshot.data.curso; //  mesmo nome dos resolve: {curso em cursos-routing

    this.form = this.fb.group({
      id: [curso.id],
      nome: [curso.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]]
    });
  }

  // não preciso mais pois está disponivel em const curso
  // updateForm(curso) {
  //   this.form.patchValue({
  //     id: curso.id,
  //     nome: curso.nome
  //   });
  // }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    if (this.form.valid) {
      console.log('submit');

      let msgSuccess = 'Curso criado com sucesso!';
      let msrError = 'Erro ao criar curso. Tente novamente!';
      if (this.form.value.id) {
        msgSuccess = 'Curso atualizado com sucesso!';
        msrError = 'Erro ao atualizar curso. Tente novamente!';
      }

      this.service.save(this.form.value).subscribe(
        success => {
          this.modal.showAlertSuccess(msgSuccess);
          this.location.back();
        },
        error => this.modal.showAlertDanger(msrError),
        () => console.log('save completo')
      );


      /* if (this.form.value.id) {
         // update
         this.service.update(this.form.value).subscribe(
           success => {
             this.modal.showAlertSuccess('Curso atualizado com sucesso!');
             this.location.back();
           },
           error => this.modal.showAlertDanger('Erro ao atualizar curso. Tente novamente!'),
           () => console.log('update completo')
         );
       } else {
         // insert
         this.service.create(this.form.value).subscribe(
           success => {
             this.modal.showAlertSuccess('Curso criado com sucesso!');
             this.location.back();
           },
           error => this.modal.showAlertDanger('Erro ao criar curso. Tente novamente!'),
           () => console.log('request completo')
         );
       }*/
    }
  }

  hasError(field: string) {
    return this.form.get(field).errors;
  }

  onCancel() {
    this.submitted = false;
    this.form.reset();
    // console.log('cancel');
  }

}
