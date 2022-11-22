import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
               private busquedasService: BusquedasService,
               private modalImageService: ModalImagenService ) { }
  
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarUsuarios();

    this.imgSubs = this.modalImageService.nuevaImagen
    /* agregarmos el delay porque así le damos tiempo a que actualice, sino, haría la petición muy rapido y no se vería actualizado */
    .pipe(
      delay(100)
    ) .subscribe( img => { this.cargarUsuarios() });
  }

  cargarUsuarios() {
    this.cargando = true;

    this.usuarioService.cargarUsuarios( this.desde )
    .subscribe( ({ total, usuarios }) => {
      this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
    })
  }

  cambiarPagina( valor: number ) {
    this.desde +=valor;

    if ( this.desde < 0) {
      this.desde = 0;
    } else if( this.desde > this.totalUsuarios ) {
      this.desde -= valor; 
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }
    
    this.busquedasService.buscar( 'usuarios', termino )
        .subscribe( (resp: Usuario[]) => {
          this.usuarios = resp;
        });
        /* hay error de "no todas las rutas devuelven algo" */
        return null;
  }

  eliminarUsuario( usuario: Usuario ) {

    if ( usuario.uid === this.usuarioService.uid ) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }
    
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario )
            .subscribe( resp => {
              this.cargarUsuarios();
              Swal.fire(
                'Usuario borrado', 
                `${ usuario.nombre } fue eliminado correctamente`,
                'success');
            });
      }
    })
  /* hay error de "no todas las rutas devuelven algo" */
  return null;
  }

  cambiarRole( usuario: Usuario ) {
    this.usuarioService.guardarUsuario( usuario )
        .subscribe( resp => {
        })
  }

  abrirModal( usuario: Usuario ) {
    this.modalImageService.abrirModal( 'usuarios', usuario.uid, usuario.img );
  }

}
