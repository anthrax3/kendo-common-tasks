/////////////////////////////////////////////////////
// Add your custom code here.
// This file and any changes you make to it are preserved every time the app is generated.
/////////////////////////////////////////////////////
import { Component, Optional } from '@angular/core';
import { DataGridComponent } from './data-grid.component';

@Component({
    selector: 'kb-bottom-section',
    template: require('./bottomSection.html')
})
export class BottomSectionComponent {
    constructor(@Optional() public parent: DataGridComponent) {
    }
}