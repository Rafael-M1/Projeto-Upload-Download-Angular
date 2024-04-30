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
import { UploadService } from '../../services/upload.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-secondpage',
  standalone: true,
  imports: [CommonModule, MatButton, MatTooltip, MatButtonModule],
  templateUrl: './secondpage.component.html',
  styleUrl: './secondpage.component.scss',
})
export class SecondpageComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private isAuthenticatedSubscription!: Subscription;
  private fileSelected!: File;

  constructor(
    private loginService: LoginService,
    private uploadService: UploadService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.isAuthenticatedSubscription = this.loginService
      .isUserAuthenticated()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
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

  onFileSelected(event: Event) {
    let inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.fileSelected = inputElement.files[0];
      inputElement.value = '';
    }
  }

  onClickUploadButton() {
    if (this.fileSelected) {
      const formData = new FormData();
      formData.append('file', this.fileSelected);
      this.uploadService.uploadFile(formData).subscribe({
        next: (value) => {
          this.toastr.success('Upload do Arquivo feito com sucesso!');
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
