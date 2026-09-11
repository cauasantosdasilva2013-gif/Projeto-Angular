import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  usuario = {
    nome: '',
    senha: ''
  }

  constructor(private auth:Auth, private router:Router){}

  login(){

    this.auth.login(this.usuario).subscribe({
      next:(response) => {
        this.router.navigate(['/home']);
      },
      error:(err) => {
        console.error("Falha no login", err);
      }
    })
  }

}
