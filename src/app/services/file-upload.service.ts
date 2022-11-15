import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string
  ) {

    try {

      const url = `${ base_url }/upload/${ tipo }/${ id }`;
      const formData = new FormData();

      formData.append('imagen', archivo);

      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if (data.ok) {
        Swal.fire({
          text: 'La imagen ha sido actualizada',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        return data.nombreArchivo;
      } else {
        Swal.fire({
          title: 'Error',
          text: 'La imagen no se ha podido actualizar, prueba con otra extensión',
          icon: 'error'
        });
        console.log(data.msg);
        return false;
      }
      
    } catch (error) {
      console.log(error);
      return false;
    }

  }

}
