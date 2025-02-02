import { Component, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from './tasks/services/language.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TrelloApp';

  cookie = inject (CookieService);
  languageService = inject (LanguageService);

  constructor(){
    console.log({cookie:this.cookie.get('lang')});
    const lang = this.cookie.check('lang')? this.cookie.get('lang') : 'en';

    this.languageService.changeLang(lang);


  }
}



