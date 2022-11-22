import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import Swal from 'sweetalert2';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
               private modalImageService: ModalImagenService,
               private busquedasService: BusquedasService ) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImageService.nuevaImagen
    /* agregarmos el delay porque así le damos tiempo a que actualice, sino, haría la petición muy rapido y no se vería actualizado */
    .pipe(
      delay(200)
    ) .subscribe( img => { this.cargarMedicos() });
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
          this.cargando = false;
          this.medicos = medicos;
        });
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.cargarMedicos();
    }
    
    this.busquedasService.buscar( 'medicos', termino )
        .subscribe( (resp: Medico[]) => {
          this.medicos = resp;
        });
        /* hay error de "no todas las rutas devuelven algo" */
        return null;
  }

  abrirModal(medico: Medico) {
    this.modalImageService.abrirModal( 'medicos', medico._id, medico.img );
  }

  borrarMedico( medico: Medico ) {

    Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico( medico._id )
            .subscribe( resp => {
              this.cargarMedicos();
              Swal.fire(
                'Medico borrado', 
                `${ medico.nombre } fue eliminado correctamente`,
                'success');
            });
      }
    })
  }

}
