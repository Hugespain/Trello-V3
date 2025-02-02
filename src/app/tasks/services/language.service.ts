import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  cookie = inject(CookieService)
  translate = inject(TranslateService)
  currentLang = signal('');

  //Usando este método puedo cambiar el idioma seleccionado en la cookie
  changeLang(lang:string){
    this.cookie.set('lang', lang);

    this.translate.setDefaultLang(lang);
    this.translate.use(lang);

    this.currentLang.set(lang);

  }

}
