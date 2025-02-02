import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {


  languajeService = inject(LanguageService);
  currentLang = this.languajeService.currentLang;



  changeLanguage(event:Event){
    const target = event.target as HTMLSelectElement;
    const lang = target.value;
    this.languajeService.changeLang(lang);
  }




  }

