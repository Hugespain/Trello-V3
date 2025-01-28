import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header-filter-box',
  templateUrl: './header-filter-box.component.html',
  styleUrls: ['./header-filter-box.component.css']
})
export class HeaderFilterBoxComponent {
  @Output() public filterText = new EventEmitter<string>();
  searchText: string = '';

  constructor() {}

  sendSearchText(event: Event): void {
    // Si vamoos al .html vemos que el evento que se dispara es un input. El método
    // sendSerachText recibe el evento como un parámetro, conteniendo información
    // sobre la interacción del usuario, incluyendo el elemento que disparó el event (event.target)
    // para acceder al value, que es lo que queremos, hay que hacer un casting a HTMLInputElement para después pasarlo a la propiedad
    // searchText. Por último, se emite el valor del texto a través del evento filterText
    //importante que aunque el método se llame sendSearchText, el evento que se dispara es filterText
    const inputElement = event.target as HTMLInputElement;
    this.searchText = inputElement.value;
    this.filterText.emit(this.searchText);
  }
}
