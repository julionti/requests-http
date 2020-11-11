import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, tap, filter, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-lib-search',
  templateUrl: './lib-search.component.html',
  styleUrls: ['./lib-search.component.scss']
})
export class LibSearchComponent implements OnInit {

  queryField = new FormControl(); // importar ReactiveFormsModule no reactive-search.module.ts
  readonly SEARCH_URL = 'https://api.cdnjs.com/libraries';
  results$: Observable<any>;
  total: number;
  FIELDS = 'name,description,version,homepage';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Programação reativa e funcional
    this.results$ = this.queryField.valueChanges // retorna um observable para queryfield
      .pipe(
        map(value => value.trim()),
        filter(value => value.length > 1), // só pesquisa valores de 2 caractares pra cima
        debounceTime(200), // tempo para digitação
        distinctUntilChanged(), // só retorna valores alterados
        // tap(value => console.log(value)),
        switchMap(value => this.http.get(this.SEARCH_URL, { // switchMap cancela requisições anteriores
          params: {
            search: value,
            fields: this.FIELDS
          }
        })),
        tap((res: any) => this.total = res.total),
        map((res: any) => res.results) // return results
      );
  }

  onSearch() { // cdnjs.com/api
    // console.log(this.queryField.value);
    let value = this.queryField.value;
    if (value && (value = value.trim()) !== '') {

      const params_ = {
        search: value,
        fields: this.FIELDS
      };

      let params = new HttpParams();
      params = params.set('search', value);
      params = params.set('fields', this.FIELDS);

      this.results$ = this.http.
        // get(this.SEARCH_URL + '?fields=' + fields + '&search=' + value)
        // get(this.SEARCH_URL, { params_ })
        get(this.SEARCH_URL, { params })
        .pipe(
          tap((res: any) => this.total = res.total),
          map((res: any) => res.results)
        );
    }
  }
}
