import { Injectable } from '@angular/core';

export interface Menu {
    stats: string;
    name: string;
    icon: string;
    role: string;
}


const MENUITEMS = [
    {
        state: 'dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        role: ''
    }
];


@Injectable()

export class MenuItems {

    getMenuitem(): any {
        return MENUITEMS;
    }
}









