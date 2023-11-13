import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { Medico } from 'src/app/_model/medico';
import { MedicoService } from 'src/app/_service/medico.service';
import { MedicoDialogoComponent } from './medico-dialogo/medico-dialogo.component';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
  
  displayedColumns = ['idMedico', 'nombres', 'apellidos', 'cmp', 'acciones'];
  
  dataSource!: MatTableDataSource<Medico>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private medicoService: MedicoService,
    private dialogo: MatDialog,
    private snackBar: MatSnackBar
  ){  }

  ngOnInit(): void {
    this.medicoService.getMedicoCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator;
      // this.ordenarTabla(data);
    });

    this.medicoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 3000 });
    });

    this.medicoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.ordenarTabla(data);
    });
     
  }

  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(row: any){
    console.log(row);
    this.medicoService.eliminar(row.idMedico).pipe(switchMap( ()=> {
      return this.medicoService.listar();
    })).subscribe(data=> {
      this.medicoService.setMedicoCambio(data);
      this.medicoService.setMensajeCambio('SE ELIMINO');
    });
  }

  ordenarTabla(data: Medico[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  abrirDialogo(medico?: Medico){
    let medicoo = medico != null ? medico : new Medico();
    this.dialogo.open(MedicoDialogoComponent, {
      width: '250px',
      data: medicoo
    });
  }
  

}
