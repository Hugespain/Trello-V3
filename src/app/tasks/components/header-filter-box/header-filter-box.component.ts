import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header-filter-box',
  templateUrl: './header-filter-box.component.html',
  styleUrls: ['./header-filter-box.component.css']
})
export class HeaderFilterBoxComponent {
  @Output() public filterDescription = new EventEmitter<string>();
  searchDescription: string = '';

  constructor() {}

  sendSearchTaskDescription(event: Event): void {
    // Si vamoos al .html vemos que el evento que se dispara es un input. El método
    // sendSerachText recibe el evento como un parámetro, conteniendo información
    // sobre la interacción del usuario, incluyendo el elemento que disparó el event (event.target)
    // para acceder al value, que es lo que queremos, hay que hacer un casting a HTMLInputElement para después pasarlo a la propiedad
    // searchDescription. Por último, se emite el valor del texto a través del evento filterText
    //importante que aunque el método se llame searchDescription, el evento que se emite es filterText
    const inputElement = event.target as HTMLInputElement;
    this.searchDescription = inputElement.value;
    this.filterDescription.emit(this.searchDescription);
  }


  @Output() public filterCategory = new EventEmitter<string>();
  searchCategory: string = '';

  sendSearchTaskCategory(event: Event): void {
    // Si vamoos al .html vemos que el evento que se dispara es un input. El método
    // sendSerachText recibe el evento como un parámetro, conteniendo información
    // sobre la interacción del usuario, incluyendo el elemento que disparó el event (event.target)
    // para acceder al value, que es lo que queremos, hay que hacer un casting a HTMLInputElement para después pasarlo a la propiedad
    // searchDescription. Por último, se emite el valor del texto a través del evento filterText
    //importante que aunque el método se llame searchDescription, el evento que se emite es filterText
    const inputElement = event.target as HTMLInputElement;
    this.searchCategory = inputElement.value;
    this.filterCategory.emit(this.searchCategory);
  }

  @Output() public filterPerson = new EventEmitter<string>();
  searchPerson: string = '';

  sendSearchTaskPerson(event: Event): void {
    // Si vamoos al .html vemos que el evento que se dispara es un input. El método
    // sendSerachText recibe el evento como un parámetro, conteniendo información
    // sobre la interacción del usuario, incluyendo el elemento que disparó el event (event.target)
    // para acceder al value, que es lo que queremos, hay que hacer un casting a HTMLInputElement para después pasarlo a la propiedad
    // searchDescription. Por último, se emite el valor del texto a través del evento filterText
    //importante que aunque el método se llame searchDescription, el evento que se emite es filterText
    const inputElement = event.target as HTMLInputElement;
    this.searchPerson = inputElement.value;
    this.filterPerson.emit(this.searchPerson);
  }
}
