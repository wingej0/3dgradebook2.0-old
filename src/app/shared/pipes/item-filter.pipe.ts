import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemFilter'
})
export class ItemFilterPipe implements PipeTransform {
  transform(items: any[], filterText: string): any {
    if (!filterText) {
      return items
    }

    return items.filter((data) =>  JSON.stringify(data).replace(/("\w+":)/g, '').toLowerCase().indexOf(filterText.toLowerCase()) !== -1);
  }

}
