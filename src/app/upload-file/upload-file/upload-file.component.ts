import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { filterResponse, uploadProgress } from 'src/app/shared/rxjs-operators';
import { UploadFileService } from '../upload-file.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  files: Set<File>; // Set Não permite arquivos duplicados
  serv;
  progress = 0;

  constructor(private service: UploadFileService) { }

  ngOnInit(): void {
  }

  onChange(event) {
    console.log(event);

    // para 1 arquivo
    const selectedFiles = event.srcElement.files as FileList;
    // document.getElementById('customFileLabel').innerHTML = selectedFiles[0].name;

    // para vários arquivos
    const fileNames = [];
    this.files = new Set();
    for (let i = 0; i < selectedFiles.length; i++) {
      fileNames.push(selectedFiles[i].name);
      this.files.add(selectedFiles[i]);
    }
    document.getElementById('customFileLabel').innerHTML = fileNames.join(', ');

    this.progress = 0; // A cada novo arquivo inicializar var
  }

  onUpload() {
    if (this.files && this.files.size > 0) {
      // Tudo q for /api não vai ser rota mas sim chamada para o backend
      this.serv = this.service.upload(this.files, environment.BASE_URL + '/upload')
        .pipe(
          uploadProgress(progress => {
            // console.log(progress);
            this.progress = progress;
          }),
          filterResponse()
        )
        .subscribe(response => console.log('Upload Concluído'));
      // .subscribe((event: HttpEvent<any>) => {
      //   // HttpEventType
      //   console.log(event);
      //   if (event.type === HttpEventType.Response) {
      //     console.log('Upload Concluído!');
      //   } else if (event.type === HttpEventType.UploadProgress) {
      //     const percentDone = Math.round(event.loaded * 100 / event.total);
      //     console.log('Progresso', percentDone);
      //     this.progress = percentDone;
      //   }
      // });

    }
  }

  OnDestroy() {
    this.serv.unsubscribe();
  }

  onDownloadExcel() {
    this.service.download(environment.BASE_URL + '/downloadExcel')
      .subscribe((res: any) => {
        this.service.handleFile(res, 'report.xlsx');
      });
  }

  onDownloadPDF() {
    this.service.download(environment.BASE_URL + '/downloadPDF')
    .subscribe((res: any) => {
      this.service.handleFile(res, 'report.pdf');
    });
  }
}
