import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/_service/login.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {

  email!: string;
  mensaje!: string;
  error!: string;
  porcentaje!: number;

  constructor(
    private loginService : LoginService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  enviar(){
    this.porcentaje = 20;
    this.loginService.enviarCorreo(this.email).subscribe(data => {
      console.log(this.porcentaje);
      if(data === 1){
        this.mensaje = "Se enviaron las indicaciones al correo."
        this.error = "";
        this.porcentaje = 100;

        console.log(this.mensaje);
        console.log(this.email);
        console.log(this.porcentaje);

      }else{
        this.error = "El usuario ingresado no existe";
        this.porcentaje = 0;
      }
    });
  }

}
