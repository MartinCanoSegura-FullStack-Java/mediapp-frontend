import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { switchMap } from 'rxjs/operators';
import { LoginService } from 'src/app/_service/login.service';
import { MenuService } from 'src/app/_service/menu.service';
import { environment } from 'src/environments/environment';
import '../../../assets/login-animation.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario!: string;
  clave!: string;
  mensaje!: string;
  error!: string;

  // variable: string = 'http://localhost:8080';
  // variable: string = 'http://localhost:8080';

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router

  ) { }

  ngOnInit(): void {
  }

  iniciarSesion() {
    console.log("loginComponent.ts..... >> antes de llamar al servicio");
    this.loginService.login(this.usuario, this.clave).pipe(switchMap((data: any) => {
      console.log(data);
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token)
      
      const helper = new JwtHelperService();

      let decodedToken = helper.decodeToken(data.access_token);

      return this.menuService.listarPorUsuario(decodedToken.user_name);
    })).subscribe(data => {
      this.loginService.setMenuCambio(data);
      this.router.navigate(['paciente']);
    });
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }


}
