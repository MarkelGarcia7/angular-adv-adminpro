import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;

  constructor( private http: HttpClient,
               private router: Router ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  /* googleInit() {
    google.accounts.id.initialize({
      client_id: "614275206268-hmcnna13847oa5llogbdk4e5g4ddo48n.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
  } */

  logOut() {
    localStorage.removeItem('token');

    this.router.navigateByUrl('/login');
    
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
        map( (resp: any) => {
          
          const {email, google, nombre, role, img = '', uid } = resp.usuario;
          
          this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
          
          localStorage.setItem('token', resp.token);

          return true;
        }),
        catchError( error => of(false) )
    );
  }

  crearUsuario( formData: RegisterForm ) {

    return this.http.post(`${ base_url }/usuarios`, formData )
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string } ) {

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, { 
      headers: {
        'x-token': this.token
      }
    });

  }

  login( formData: LoginForm ) {

    return this.http.post(`${ base_url }/login`, formData )
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  loginGoogle( token: string ) {

    return this.http.post(`${ base_url }/login/google`, { token }) 
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }
}
