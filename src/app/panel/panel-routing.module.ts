import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MesComponent } from './mes/mes.component';
import { MesesComponent } from './meses/meses.component';
import { PanelComponent } from './panel.component';

const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      { path: '', component: MesesComponent, },
      { path: 'mes/:id', component: MesComponent, },
      //{ path: 'add', component: MesComponent, },
    ]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
