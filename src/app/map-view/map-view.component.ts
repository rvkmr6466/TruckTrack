import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  total: boolean = false;
  running: boolean = false;
  stopped: boolean = false;
  idle: boolean = false;
  error: boolean = false;
  totalTruck: number = 0;
  totalRunningTruck: number = 0;
  totalStoppedTruck: number = 0;
  totalIdleTruck: number = 0;
  totalErrorTruck: number = 0;
  truckNumber: string = "";
  stoppedSince: string = '';
  runningTruck: boolean = true;
  truckData: any;
  allTruckData: any;
  totalTruckArray: Array<any> = [];
  runningTruckDataArray: Array<any> = [];
  stoppedTruckDataArray: Array<any> = [];
  idleTruckDataArray: Array<any> = [];
  errorTruckDataArray: Array<any> = [];
  lat = 51.678418;
  lng = 7.809007;
  value: string = '';
  search: string = '';
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};
  multiselectCheck: boolean = false;
  totalSelectTruckData: number = 0;
  selectTruckData: any = [];
  runningSelectTruckDataArray: any = [];
  stoppedSelectTruckDataArray: any = [];
  idleSelectTruckDataArray: any = [];
  errorSelectTruckDataArray: any = [];

  constructor(
    public http: HttpClient
  ) { }

  ngOnInit(): void {
    let url = 'https://api.mystral.in/tt/mobile/logistics/searchTrucks?auth-company=PCH&companyId=33&deacti vated=false&key=g2qb5jvucg7j8skpu5q7ria0mu&q-expand=true&q-include=lastRunningState,last Waypoint';
    this.http.get<any>(url).subscribe(
      (response: any) => {
        if (response) {
          this.manageResponse(response);
        }
      },
      (error: any) => {
        console.error(error)
      }
    );
  }

  selectedTruckDiv(str: string) {
    switch (str) {
      case 'total':
        {
          this.total = true;
          this.running = false;
          this.stopped = false;
          this.idle = false;
          this.error = false;
          this.truckData = this.totalTruckArray;
        }
        break;
      case 'running':
        {
          this.total = false;
          this.running = true;
          this.stopped = false;
          this.idle = false;
          this.error = false;
          this.truckData = this.runningTruckDataArray;
        }
        break;
      case 'stopped':
        {
          this.total = false;
          this.running = false;
          this.stopped = true;
          this.idle = false;
          this.error = false;
          this.truckData = this.stoppedTruckDataArray;
        }
        break;
      case 'idle':
        {
          this.total = false;
          this.running = false;
          this.stopped = false;
          this.idle = true;
          this.error = false;
          this.truckData = this.idleTruckDataArray;
        }
        break;
      case 'error':
        {
          this.total = false;
          this.running = false;
          this.stopped = false;
          this.idle = false;
          this.error = true;
          this.truckData = this.errorTruckDataArray;
        }
        break;
      default:
        this.total = false;
        this.running = false;
        this.stopped = false;
        this.idle = false;
        this.error = false;
    }
  }

  manageResponse(data: any) {
    this.totalTruck = data.data.length;
    this.truckData = data.data;
    this.allTruckData = data.data;
    this.totalTruckArray = this.truckData;
    this.allFilterData(this.truckData);
    this.total = true;
    this.dropdownList = [...this.truckData];
    console.log(this.truckData);
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'truckNumber',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }

  allFilterData(data: any) {
    this.runningTruckDataArray = this.filterTruckList(data, 'running');
    this.stoppedTruckDataArray = this.filterTruckList(data, 'stopped');
    this.idleTruckDataArray = this.filterTruckList(data, 'idle');
    this.errorTruckDataArray = this.filterTruckList(data, 'error');
  }


  onItemSelect(item: any) {
    this.multiselectCheck = true;
    console.log(item);
    for (let i of this.truckData) {
      if (i.id == item.id) {
        this.selectTruckData.push(i);
      }
    }

    this.allFilterData(this.selectTruckData);
  }

  onItemDeSelect(item: any) {
    this.multiselectCheck = true;
    const index = this.selectTruckData.findIndex((key: any) => key.id == item.id);
    this.selectTruckData.splice(index, 1);
    this.allFilterData(this.selectTruckData);
  }

  onDeSelectAll(item: any) {
    this.multiselectCheck = true;
    this.selectTruckData = [];
    this.allFilterData(this.selectTruckData);
  }

  onSelectAll(items: any) {
    this.multiselectCheck = true;
    this.selectTruckData = [...this.allTruckData];
    this.allFilterData(this.selectTruckData);
    console.log(items);
  }

  filterTruckList(truckDataArray: any, str: string) {
    let arr: any = [];
    this.totalTruck = truckDataArray.length;
    if (str == 'running') {
      for (let i = 0; i < truckDataArray.length; i++) {
        //0 = stopped and 1 for running
        if (truckDataArray[i].lastRunningState.truckRunningState == 1) {
          arr.push(truckDataArray[i]);
        }
        else continue
      }
      this.totalRunningTruck = arr.length;
    }
    else if (str == 'stopped') {
      for (let i of truckDataArray) {
        if (!!typeof i.lastWaypoint) {
          continue
        }
        else if (i.lastWaypoint?.ignitionOn == 'false') {
          arr.push(truckDataArray[i]);
        }
      }
      this.totalStoppedTruck = arr.length;
    }
    else if (str == 'idle') {
      for (let i of truckDataArray) {
        if (!!typeof i.lastWaypoint) {
          continue
        }
        else if (i.lastWaypoint?.ignitionOn == 'true') {
          arr.push(truckDataArray[i]);
        }
      }
      this.totalIdleTruck = arr.length;
    }
    else if (str == 'error') {
      let arr1 = [];
      for (let i of truckDataArray) {
        arr1.push(i.lastRunningState.stopStartTime - i.createTime);

      }
      this.totalErrorTruck = arr.length;
    }
    return arr;
  }

  sendTheNewValue(event: any) {
    this.value = event.target.value;
    console.log(this.value);
    if (this.value.length > 1) {
      this.truckData = this.truckData.filter(
        (item: any) => {
          console.log(_.includes(this.value.toLocaleLowerCase(), item.truckNumber.toLocaleLowerCase()));
          if (_.includes(this.value.toLocaleLowerCase(), item.truckNumber.toLocaleLowerCase()))
            return item;
        }
      );
    }
  }

  checkData(event: any){
    console.log(event.data)
  }
}
