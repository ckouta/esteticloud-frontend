import { Pipe, PipeTransform } from '@angular/core';
import Swal from 'sweetalert2';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      if(it.nombre!=null){
        return it.nombre.toLocaleLowerCase().includes(searchText);
      }else{
        return it.servicio.nombre.toLocaleLowerCase().includes(searchText);
      }
     
    });
  }
}