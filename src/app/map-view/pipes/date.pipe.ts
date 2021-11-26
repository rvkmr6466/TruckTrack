import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'mydatefilter'
})
export class MyDatePipe implements PipeTransform {
    transform(value: any): any {
        var min;
        var t1 = new Date(value);
        var t2 = new Date();
        var dif = t2.getTime() - t1.getTime();
        if(dif > 86400000){
            min = Math.round((dif / (60*60*24*1000)))+'d';
        }
        else{
            min = Math.round(Math.floor((dif / 1000 / 60) << 0))+ ' min';
        }
        return min;
    }

}