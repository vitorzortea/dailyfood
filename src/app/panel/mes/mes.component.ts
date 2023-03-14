import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Calendario, Refeicoes } from 'src/app/models/tables.model';
import { CalendarioService } from 'src/app/services/calendario.service';
import { CompressImageService } from 'src/app/services/compress-image-service.service';
import { RefeicoesService } from 'src/app/services/refeicoes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mes',
  templateUrl: './mes.component.html',
  styleUrls: ['./mes.component.scss']
})
export class MesComponent implements OnInit {
  isload = false;

  //dias:Dia[] = [] // temp
  id:string = '';
  calendario:Calendario
  calendarioPrint:Calendario

  //form
  formRefeicoes = `<label class="label-swal">Horas:<input id="hora-input" type="time" class="form-control" required></label><label class="label-swal">Refeição:<input id="comida-input" class="form-control" required></label><label class="label-swal">Foto:<input id="foto-input" type="file" accept="image/png, image/jpeg" class="form-control"></label>`;
  formDia = `<label class="label-swal">Dia:<input id="dia-input" type="number" min="1" max="31" class="form-control" required></label>`;

  refDia

  constructor(
    private service: CalendarioService,
    private serviceRefeicoes: RefeicoesService,
    private route: ActivatedRoute,
    private compressImage: CompressImageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((res:any)=>{
      this.id = res.params.id;
      this.updateList();
    });
  }
  
  createDia(){
    Swal.fire({title: 'Novo Dia',html:this.formDia,confirmButtonText:"Salvar a Dia",focusConfirm: false,
      preConfirm: () => {
        const diaValue = document.querySelector('#dia-input') as HTMLInputElement;
        if(diaValue.value){
          this.calendario.dias.push({nome: diaValue.value, refeicoes: []})
          this.calendario.dias = this.calendario.dias.sort((a,b) => parseInt(a.nome) - parseInt(b.nome));
          this.service.createOrUpdate(this.calendario).then(()=>{
            this.updateList();
            Swal.fire({icon: 'success',title: 'Dia Salvo'})
          })
        }
        else{ Swal.showValidationMessage('Preencha todos os campos obrigatórios') }
      }
    })
  }
  deleteDia(index){
    console.log('index', index);
    console.log('this.calendario.dias', this.calendario.dias);
    console.log('this.calendario.dias[index]', this.calendario.dias[index]);
    Swal.fire({
      title: 'Deseja Deletar esse Dia?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: `Não`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.calendario.dias.splice(index, 1);
        console.log('this.calendario.dias', this.calendario.dias);
        this.service.createOrUpdate(this.calendario).then(()=>{ 
          Swal.fire({icon: 'success',title: 'Refeição Deletada'})
          this.updateList();
        });
      } 
    })
  }


  createRefeicoes(index:number){
    Swal.fire({
      title:'Nova Refeição', html:this.formRefeicoes, confirmButtonText:"Salvar a Refeição", focusConfirm: false,
      preConfirm: () => {
        const horaValue = document.querySelector('#hora-input') as HTMLInputElement;
        const comidaValue = document.querySelector('#comida-input') as HTMLInputElement;
        const fotoFile = document.querySelector('#foto-input') as HTMLInputElement;

        const newRefeicoes = {hora:horaValue.value,prato:comidaValue.value, foto: fotoFile} as Refeicoes

        if(horaValue.value && comidaValue.value){
          this.saveRefeicoes(newRefeicoes, index).subscribe(e=>{
            this.calendario.dias[index].refeicoes.push(e.id);
            this.service.createOrUpdate(this.calendario).then(()=>{
              this.updateList();
              Swal.fire({icon: 'success',title: 'Refeição Salva'})
            })
          });
        }else{ Swal.showValidationMessage('Preencha todos os campos obrigatórios') }
      }
    });
  }
  deleteRefeicoes(indexDia, index){
    Swal.fire({
      title: 'Deseja Deletar essa refeição?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: `Não`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceRefeicoes.delete(this.calendarioPrint.dias[indexDia].refeicoes[index].id).then(()=>{
          const indexDelete = this.calendario.dias[indexDia].refeicoes.indexOf(e=>e.id == this.calendarioPrint.dias[indexDia].refeicoes[index].id);
          console.log('indexDelete: ', indexDelete);
          this.calendario.dias[indexDia].refeicoes.splice(indexDelete, 1);
          this.service.createOrUpdate(this.calendario).then(()=>{ 
            Swal.fire({icon: 'success',title: 'Refeição Deletada'})
            this.updateList();
          });
        })
      } 
    })
  }



  openImage(src:string){
    Swal.fire({
      html: `<img src="${src}">`,
      showConfirmButton: false,
    })
  }



  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  updateList(){
    this.isload = false;
    this.service.get(this.id).subscribe(res=>{
      this.calendario = JSON.parse(JSON.stringify(res));
      if(!this.calendario.dias.length){this.isload = true;}
      res.dias.forEach((e,i)=>{
        if(res.dias.length == (i+1)){
          this.calendarioPrint = JSON.parse(JSON.stringify(res));
          this.isload = true;
        }
        let getNumber = 0;
        e.refeicoes.forEach((f, i)=>{
          this.serviceRefeicoes.get(f).subscribe(resRefeicao=>{
            getNumber++;
            e.refeicoes[i] = resRefeicao;
            if(getNumber == e.refeicoes.length){
              e.refeicoes = e.refeicoes.sort((a,b) => parseInt(a.hora.replace(/[^0-9]/g,'')) - parseInt(b.hora.replace(/[^0-9]/g,'')));
              this.calendarioPrint = JSON.parse(JSON.stringify(res));
              this.isload = true;
            }
          })
        })
      });
    });
    
  }



  saveRefeicoes(refeicao:Refeicoes, index:number):Observable<Refeicoes>{
    return new Observable<Refeicoes>(observador => {
      if(refeicao.foto.files[0]){
        this.compressImage.compress(refeicao.foto.files[0])
        .pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          this.getBase64(compressedImage).then(
            (data)=>{
              refeicao.foto = data;
              this.serviceRefeicoes.createOrUpdate(refeicao).then(()=>{
                observador.next(refeicao);
              })
            }
          );
        });
      }else{
        refeicao.foto = '';
        this.serviceRefeicoes.createOrUpdate(refeicao).then(()=>{
          observador.next(refeicao);
        })
      }
    });
  }
  
}
