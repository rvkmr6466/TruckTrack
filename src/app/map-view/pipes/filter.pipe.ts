import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(value: any, searchValue: any): any {
        if (!searchValue) return value;
        return value.filter((v: any) =>
            v.truckNumber.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)

    }

}