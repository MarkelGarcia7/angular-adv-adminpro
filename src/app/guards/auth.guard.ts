import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  
  constructor( private usuarioService: UsuarioService,
               private router: Router ) {}
  
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    return this.usuarioService.validarToken()
        .pipe(
          tap( (estaAutenticado: any) => {
            
            if ( !estaAutenticado ) {
              this.router.navigateByUrl('/login')
            }
          } )
        )
  }
  
}
