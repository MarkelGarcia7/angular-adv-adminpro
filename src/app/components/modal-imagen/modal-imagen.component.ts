import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any = null;

  constructor( public modalImageService: ModalImagenService,
               public fileUploadService: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImageService.cerrarModal();
  }

  cambiarImagen( file: File ) {
    this.imagenSubir = file;

    /* con esto hacemos que si alguien le da a subir archivo y lo cancela, vuelva a aparecer la imagen que tiene */
    if ( !file ) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {

    const id = this.modalImageService.id;
    const tipo = this.modalImageService.tipo;

    this.fileUploadService
      .actualizarFoto( this.imagenSubir, tipo , id )
      /* al hacerlo de esta manera (pasarlo por referencia) hacemos que se actualice en todos los sitios al momento */
      .then( img =>  {
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');

        this.modalImageService.nuevaImagen.emit(img);

        this.cerrarModal();
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      })
  }

}
