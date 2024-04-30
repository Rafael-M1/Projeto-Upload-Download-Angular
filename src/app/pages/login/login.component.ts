import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginForm } from '../../model/login-form';
import { AuthObject } from '../../model/auth-object';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;
  isButtonDisabled: boolean = false;
  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    this.redirecionaUsuarioLogado();
  }

  onClickEntrar() {
    if (this.formulario.valid) {
      this.isButtonDisabled = true;
      let novoLoginForm: LoginForm = {
        username: this.formulario.value.username,
        password: this.formulario.value.password,
        client: 'angular',
        grant_type: 'password',
      };
      this.loginService.logar(novoLoginForm).subscribe({
        next: (value: AuthObject) => {
          localStorage.setItem('token', value.access_token);
          this.loginService.setIsAuthenticatedSubject(true);
          this.toastr.success('Login bem-sucedido!');
          this.route.navigate(['about']);
          this.isButtonDisabled = false;
        },
        error: (error) => {
          this.imprimeMensagemErroAoLogar(error);
          this.isButtonDisabled = false;
        },
      });
    } else {
      this.toastr.error('', 'Usuário e Senha são obrigatórios.');
    }
  }

  imprimeMensagemErroAoLogar(errorObject: any) {
    if (
      errorObject &&
      errorObject.error &&
      errorObject.error.error_description == 'Bad credentials'
    ) {
      this.toastr.error('', 'Usuário ou senha inválidos!');
    }
    if (errorObject && errorObject.statusText == 'Unknown Error') {
      this.toastr.error('', 'Erro ao conectar ao Sistema!');
    }
  }

  redirecionaUsuarioLogado() {
    this.loginService.isUserAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.route.navigate(['']);
      }
    });
  }

  // logging() {
  //   console.log(this.formulario.get('username')?.errors);
  //   console.log(this.formulario.get('username'));
  //   console.log(this.formulario.get('password'));
  // }
}
