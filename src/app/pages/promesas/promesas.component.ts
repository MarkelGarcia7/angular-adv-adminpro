import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then( usuarios => {
      console.log(usuarios);
    } )

    /* const promesas = new Promise( ( resolve, reject ) => {

      if( false ) {
        resolve('¡hola mundo!')
      } else {
        reject('Algo salió mal')
      }      

    }); 
    
    promesas
      .then( (mensaje) => {
        console.log(mensaje);
    })
    .catch( error => console.log('Error en mi promesa', error) );

    console.log('fin del init') */
  }

  getUsuarios() {

    return new Promise( resolve => {

      fetch('https://reqres.in/api/users')
      .then( resp => resp.json())
      .then( body => resolve( body.data ) )

    } );

  }

}
