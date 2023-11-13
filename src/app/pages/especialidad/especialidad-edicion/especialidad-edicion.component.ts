import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Especialidad } from 'src/app/_model/especialidad';
import { EspecialidadService } from 'src/app/_service/especialidad.service';

@Component({
  selector: 'app-especialidad-edicion',
  templateUrl: './especialidad-edicion.component.html',
  styleUrls: ['./especialidad-edicion.component.css']
})
export class EspecialidadEdicionComponent implements OnInit {

  id!: number;
  especialidad!: Especialidad;
  form!: FormGroup;
  edicion: boolean = false;

  constructor(
    private especialidadService: EspecialidadService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {

    this.especialidad = new Especialidad();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.especialidadService.listarPorId(this.id).subscribe(data => {
        let id = data.idEspecialidad;
        let nombre = data.nombre;
        let descripcion = data.descripcion;
        this.form = new FormGroup({
          'id': new FormControl(id),
          'nombre': new FormControl(nombre),
          'descripcion': new FormControl(descripcion)
        });
      });
    }
  }

  operar() {
    this.especialidad.idEspecialidad = this.form.value['id'];
    this.especialidad.nombre = this.form.value['nombre'];
    this.especialidad.descripcion = this.form.value['descripcion'];

    if (this.especialidad != null && this.especialidad.idEspecialidad > 0) {
      //BUENA PRACTICA
      this.especialidadService.modificar(this.especialidad).pipe(switchMap(() => {
        return this.especialidadService.listar();
      })).subscribe(data => {
        this.especialidadService.setEspecialidadCambio(data);
        this.especialidadService.setMensajeCambio("SE MODIFICO");
      });

    } else {
      //PRACTICA COMUN
      this.especialidadService.registrar(this.especialidad).subscribe(data => {
        this.especialidadService.listar().subscribe(especialidad => {
          this.especialidadService.setEspecialidadCambio(especialidad);
          this.especialidadService.setMensajeCambio("SE REGISTRO");
        });
      });
    }

    this.router.navigate(['especialidad']);
  }
  
}
