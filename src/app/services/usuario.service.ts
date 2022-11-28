import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { map, tap, Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario!: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
      'x-token': this.token
      }
    }
  }

  /* googleInit() {
    google.accounts.id.initialize({
      client_id: "614275206268-hmcnna13847oa5llogbdk4e5g4ddo48n.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
  } */

  guardarLocalStorage( token: string, menu: any ) {
    localStorage.setItem( 'token', token );
    localStorage.setItem( 'menu', JSON.stringify(menu) );
  }

  logOut() {
    localStorage.removeItem('token');

    localStorage.removeItem('menu');

      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    
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

          this.guardarLocalStorage( resp.token, resp.menu );

          return true;
        }),
        catchError( error => of(false) )
    );
  }

  crearUsuario( formData: RegisterForm ) {

    return this.http.post(`${ base_url }/usuarios`, formData )
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage( resp.token, resp.menu );
                  })
                );
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string } ) {

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers );

  }

  login( formData: LoginForm ) {

    return this.http.post(`${ base_url }/login`, formData )
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage( resp.token, resp.menu );
                  })
                );
  }

  loginGoogle( token: string ) {

    return this.http.post(`${ base_url }/login/google`, { token }) 
      .pipe(
        tap( (resp: any) => {
          this.guardarLocalStorage( resp.token, resp.menu );
        })
      )
  }

  cargarUsuarios( desde: number = 0 ) {

    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuarios>( url, this.headers )
              .pipe(
                map( resp => {
                  const usuarios = resp.usuarios.map( 
                    user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid) 
                    );

                  return {
                    total: resp.total,
                    usuarios
                  };
                })
              )
  }

  eliminarUsuario( usuario: Usuario ) {
    
    /* usuarios/6368fb33799a2c30b5b5ef4f */
    const url = `${ base_url }/usuarios/${ usuario.uid }`;
    return this.http.delete( url, this.headers );

  }

  guardarUsuario( usuario: Usuario ) {

    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers );

  }
}
