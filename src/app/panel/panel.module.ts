import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { MesComponent } from './mes/mes.component';
import { MesesComponent } from './meses/meses.component';
import { PanelComponent } from './panel.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MesComponent,
    MesesComponent,
    PanelComponent,
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    FormsModule,
  ]
})
export class PanelModule { }
