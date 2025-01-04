import { Component, EventEmitter, Output } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { UtilitiesService } from '../services/utilities.service';

@Component({

    selector: 'footer',
    standalone: true,
    imports: [ButtonModule],
    template:  `
         `,
    templateUrl:'./footer.html',
    styleUrl:'./footer.css'
})
export class Footer {

    constructor(public ref: DynamicDialogRef,private utilitiesService:UtilitiesService) {}
    
    closeDialog(data:any) {
        this.utilitiesService.showModal(false); //
        // this.isView=false;
        this.ref.close(data);
    }
    onSubmit(data:any){
        // this.isView=true;
        this.utilitiesService.showModal(true); //
        this.ref.close(data);
    }
}