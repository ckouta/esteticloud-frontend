import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/entidades/Cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-clientes',
  templateUrl: './registrar-clientes.component.html',
  styleUrls: ['./registrar-clientes.component.css']
})
export class RegistrarClientesComponent implements OnInit {
  clienteActualizar: Cliente = null;
  formCliente: FormGroup;
  show:boolean= false;
  constructor(private router: Router,
    public restService: RestService,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute) {
     }

  ngOnInit() {

    this.rutaActiva.queryParams.subscribe(params => {
        let dato = params['ver'];
        if(dato=="true"){
          this.show= true;
        }
      });
      this.formCliente = this.formBuilder.group({
        id_cliente:[''],
        nombre: [{value: '', disabled: this.show}, [Validators.required]],
        apellido: [{value: '', disabled: this.show}, [Validators.required]],
        telefono: [{value: '', disabled: this.show}, [Validators.required]],
        email: [{value: '', disabled: this.show}, [Validators.required]],
        rut: [{value: '', disabled: this.show}, [Validators.required]],
      });
    if (this.rutaActiva.snapshot.params.id != null) {
      this.restService.getCliente(this.rutaActiva.snapshot.params.id).subscribe((res: any) => {
       this.clienteActualizar = res;
       this.formCliente.setValue({
         id_cliente: this.clienteActualizar.id_cliente,
         nombre: this.clienteActualizar.nombre,
         apellido: this.clienteActualizar.apellido,
         telefono: this.clienteActualizar.telefono,
         email: this.clienteActualizar.email,
         rut: this.clienteActualizar.rut
       });
       console.log(this.clienteActualizar)
     })
   }
  }
  saveData() {
    console.log(this.formCliente.value);
    let cliente: Cliente = this.formCliente.value;
    if(cliente.id_cliente == null){
      this.restService.saveCliente(cliente).subscribe(() => {
        Swal.fire('Solicitud aceptada', 'El cliente ha sido agregado', 'success');
        return this.router.navigate(['profesional/clientes'])
      },err =>{
        Swal.fire('Solicitud rechazada', 'El cliente no se pudo agregar', 'error');
      })
    }else{
      this.actualizarCliente(cliente);
    }
    
  }
  actualizarCliente(cliente: Cliente) {

    this.restService.updateCliente(cliente.id_cliente, cliente).subscribe(() => {
      Swal.fire('Solicitud aceptada', 'El cliente ha sido actualizado', 'success');
      return this.router.navigate(['profesional/clientes'])
    }, err =>{
      Swal.fire('Solicitud rechazada', 'El cliente no se pudo actualizar', 'error');
    })
  }
}
