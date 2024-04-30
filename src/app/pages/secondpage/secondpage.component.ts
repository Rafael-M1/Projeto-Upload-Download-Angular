import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';
import { FileService } from '../../services/file.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FileObject } from '../../model/file';

@Component({
  selector: 'app-secondpage',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatTooltip,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './secondpage.component.html',
  styleUrl: './secondpage.component.scss',
})
export class SecondpageComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private isAuthenticatedSubscription!: Subscription;
  private fileSelected!: File;
  private filesDataTable!: FileObject[];
  displayedColumns: string[] = [
    'idArchive',
    'contentType',
    'originalFileName',
    'bytes',
    'acoes',
  ];

  constructor(
    private loginService: LoginService,
    private fileService: FileService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.isAuthenticatedSubscription = this.loginService
      .isUserAuthenticated()
      .subscribe((isAuthenticated) => (this.isAuthenticated = isAuthenticated));
    this.getUpdatedFileList();
  }

  getUpdatedFileList() {
    this.fileService
      .getFiles()
      .subscribe(
        (listaFiles: FileObject[]) => (this.filesDataTable = listaFiles)
      );
  }
  ngOnDestroy(): void {
    this.isAuthenticatedSubscription.unsubscribe();
  }
  onClickPrimaryButton() {
    console.log('Botão primary clicado');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed', result);
    });
  }

  get fileSelectedName(): string {
    if (this.fileSelected) {
      return `Arquivo selecionado: ${this.fileSelected.name}`;
    }
    return `Arquivo selecionado: `;
  }

  get ListFiles() {
    return this.filesDataTable;
  }

  onFileSelected(event: Event) {
    let inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.fileSelected = inputElement.files[0];
      inputElement.value = '';
    }
  }
  onClickDeleteButton(fileObject: FileObject) {
    console.log('Botão de excluir clicado', fileObject);
    if (fileObject) {
      this.fileService.deleteFile(fileObject.idArchive).subscribe({
        next: (value) => {
          this.toastr.success('Sucesso ao excluir o Arquivo!');
          this.getUpdatedFileList();
        },
        error: (error) => {
          this.toastr.error('Falha ao excluir o Arquivo.');
        },
      });
    }
  }

  onClickUploadButton() {
    if (this.fileSelected) {
      const formData = new FormData();
      formData.append('file', this.fileSelected);
      this.fileService.uploadFile(formData).subscribe({
        next: (value) => {
          this.toastr.success('Upload do Arquivo feito com sucesso!');
          this.getUpdatedFileList();
        },
        error: (error) => {
          this.toastr.error('Falha ao fazer Upload do Arquivo.');
        },
      });
    } else {
      this.toastr.warning('Selecione um arquivo primeiro.');
    }
  }
}
