import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import Swal from 'sweetalert2';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
               private modalImageService: ModalImagenService,
               private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImageService.nuevaImagen
    /* agregarmos el delay porque así le damos tiempo a que actualice, sino, haría la petición muy rapido y no se vería actualizado */
    .pipe(
      delay(100)
    ) .subscribe( img => { this.cargarHospitales() });
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.cargarHospitales();
    }
    
    this.busquedasService.buscar( 'hospitales', termino )
        .subscribe( (resp: Hospital[]) => {
          this.hospitales = resp;
          
        });
        /* hay error de "no todas las rutas devuelven algo" */
        return null;
  }

  cargarHospitales() {

    this.cargando = true;

    this.hospitalService.cargarHospitales()
        .subscribe( hospitales => {
          this.cargando = false;
          this.hospitales = hospitales;
        })
  }

  guardarCambios( hospital: Hospital ) {

    this.hospitalService.actualizarHospital( hospital._id, hospital.nombre )
        .subscribe( resp => {
          Swal.fire( 'Actualizado', hospital.nombre, 'success' );
        })
  }

  eliminarHospital( hospital: Hospital ) {

    this.hospitalService.borrarHospital( hospital._id )
        .subscribe( resp => {
          this.cargarHospitales();
          Swal.fire( 'Borrado', hospital.nombre, 'success' );
        })
  }

  async abrirSweetAlert() {

    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })

    if ( value.trim().length > 0 ) {
      this.hospitalService.crearHospital( value )
          .subscribe( (resp: any) => {
            this.hospitales.push( resp.hospital )
          })
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImageService.abrirModal( 'hospitales', hospital._id, hospital.img );
  }

}
