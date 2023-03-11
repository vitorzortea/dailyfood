import { Component, OnInit } from '@angular/core';
import { Mes } from 'src/app/models/tables.model';
import { CalendarioService } from 'src/app/services/calendario.service';
import { MesService } from 'src/app/services/mes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meses',
  templateUrl: './meses.component.html',
  styleUrls: ['./meses.component.scss']
})
export class MesesComponent implements OnInit {
  meses: Mes[] = [];

  refCalendaro:any = {nome: '', ano: '', dias:[]};

  constructor(
    private service:MesService,
    private serviceCalendario: CalendarioService,
  ) { }

  ngOnInit(): void {this.updateList()}

  createMes(){
    Swal.fire({
      title: 'Novo Mês',
      html:
        `
        <label class="label-swal">
          Dia:
          <input id="mes-input" type="month" class="form-control">
        </label>
        `,
      confirmButtonText:"Salvar a Refeição",
      focusConfirm: false,
      preConfirm: () => {
        const mesInput = document.querySelector('#mes-input') as HTMLInputElement;
        if(mesInput.value){
          const arrayDate = mesInput.value.split('-');
          this.refCalendaro.nome = arrayDate[1];
          this.refCalendaro.ano = arrayDate[0];
          this.serviceCalendario.createOrUpdate(this.refCalendaro).then((e)=>{
            this.service.createOrUpdate({nome: arrayDate[1], ano: arrayDate[0], calendario: this.refCalendaro.id})
            .then(()=>{this.updateList()})
          })
        }
        else{ Swal.showValidationMessage('Preencha todos os campos obrigatórios') }
      }
    })
  
  }

  deleteMes(id){
    this.service.get(id).subscribe(e=>{
      this.serviceCalendario.delete(e.calendario).then(()=>{
        this.service.delete(id).then(()=>{this.updateList()});
      })
    })
  }

  convertMes(mesSelect):string{
    const mesesString = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    return mesesString[mesSelect - 1];
  }

  updateList(){ this.service.list().subscribe(res=>{ this.meses = res }) }

}
