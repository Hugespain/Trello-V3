import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, tap} from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class MyInterceptorService implements HttpInterceptor {

  constructor( private snackBar: MatSnackBar) { }
  //Debo proorcionar una implementación para el método intercept
  //El mensaje de éxito o error dependerá de si la petición se ha realizado correctamente o no
  //Para saber si la petición se ha realizado correctamente, debo suscribirme al observable que devuelve next.handle(req)
  //Si la petición se ha realizado correctamente, debo mostrar un mensaje de éxito --> HttpEvent es de tipo HttpResponse
  //Si la petición no se ha realizado correctamente, debo mostrar un mensaje de error --> Si no se ha podido realizar la petición, el observable devolverá un error (catcherror)
  //Los mensajes que quiero mostrar son considerados como efectos secundarios, por lo que debo usar el operador tap
  //Sin embargo, catchError ya se encarga de manejar los errores, por lo que no necesito usar tap para mostrar el mensaje de error
  //Con esto tengo que conseguir mostrar un mensaje de éxito o error usando un MatSnackBar
  intercept(req: HttpRequest<Task>, next: HttpHandler): Observable<HttpEvent<Task>> {
    // Verificar si el método es POST, PATCH o DELETE y si la URL contiene '/tasks'
    if (['GET', 'PUT', 'POST', 'PATCH', 'DELETE'].includes(req.method) && req.url.includes('/tasks')) {
      return next.handle(req).pipe(

      tap({next: (event: HttpEvent<Task>) => {
        if (event.type === HttpEventType.Response) {
        this.snackBar.open('Operación exitosa', 'Cerrar', { duration: 3000 });
      }
    },error: () => {this.snackBar.open('Ocurrió un error', 'Cerrar', { duration: 3000 })}})
      );
    } else {
      // Si el método no es POST, PATCH o DELETE, o la URL no contiene '/tasks', pasar la solicitud sin modificarla
      return next.handle(req);
    }
  }
}


