import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn?: ElementRef;

  public formSubmitted = false;

  loginForm: FormGroup;

  constructor( private fb: FormBuilder, 
               private router: Router,
               private usuarioService: UsuarioService 
              ) 
  { 
    this.loginForm = this.fb.group({
      email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
      password: [ '', Validators.required ],
      remember: [ false ]
    });
  }
  
  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {

    google.accounts.id.initialize({
      client_id: "614275206268-hmcnna13847oa5llogbdk4e5g4ddo48n.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      /* document.getElementById("buttonDiv"), */
      this.googleBtn?.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response: any ) {

    console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle( response.credential )
      .subscribe( resp => {
        /* console.log({ login: resp }) */
        this.router.navigateByUrl('/');
      })
  }

  login() {

    this.usuarioService.login( this.loginForm.value )
        .subscribe( resp => {

          if (this.loginForm.get('remember')?.value) {
            localStorage.setItem('email', this.loginForm.get('email')?.value);
          } else {
            localStorage.removeItem('email');
          }

          Swal.fire('Success', 'usuario logueado correctamente', 'success');

          /* navegar al dashboard */
          this.router.navigateByUrl('/');
        }, (err) => {
          /*  si sucede un error, el primer Error es el mensaje y el ultimo es la X */
          Swal.fire('Error', err.error.msg, 'error');
        } );
    /* navegar al dashboard */
    this.router.navigateByUrl('/')

  }

}
