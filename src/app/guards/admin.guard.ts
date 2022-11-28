import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  /* este guard sirve para que si un usuario no admin intenta entrar a la página 
      de usuarios para que lo detenga y que lo redirija al dashboard */

  constructor( private usuarioService: UsuarioService,
               private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
      /* ES LO MISMO EL IF ELSE QUE PONER EL TERNARIO */
      /* return (this.usuarioService.role == 'ADMIN_ROLE') ? true : false; */
      if (this.usuarioService.role == 'ADMIN_ROLE') { 
        return true;
      } else {
        this.router.navigateByUrl('/dashboard');
        return false;
      }
  }
  
}
