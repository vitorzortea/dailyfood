import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Calendario } from 'src/app/models/tables.model';
import { CalendarioService } from 'src/app/services/calendario.service';
import { CompressImageService } from 'src/app/services/compress-image-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mes',
  templateUrl: './mes.component.html',
  styleUrls: ['./mes.component.scss']
})
export class MesComponent implements OnInit {
  isload = false;

  dias:Dia[] = [] // temp
  id:string = '';
  calendario:Calendario

  refDia

  constructor(
    private service: CalendarioService,
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
    Swal.fire({
      title: 'Novo Dia',
      html:
        `
        <label class="label-swal">
          Dia:
          <input id="dia-input" type="number" min="1" max="31" class="form-control" required>
        </label>
        `,
        confirmButtonText:"Salvar a Refeição",
      focusConfirm: false,
      preConfirm: () => {
        const diaValue = document.querySelector('#dia-input') as HTMLInputElement;
        if(diaValue.value){
          this.calendario.dias.push({nome: diaValue.value, refeicoes: []})
          this.calendario.dias = this.calendario.dias.sort((a,b) => parseInt(a.nome) - parseInt(b.nome));
          this.service.createOrUpdate(this.calendario).then(()=>{/*this.updateList()*/})
        }
        else{ Swal.showValidationMessage('Preencha todos os campos obrigatórios') }
      }
    })
  }
  deleteDia(index){
    this.calendario.dias.splice(index, 1);
    this.service.createOrUpdate(this.calendario).then(()=>{/*this.updateList()*/})
  }


  createRefeicao(index:number){
    Swal.fire({
      title: 'Nova Refeição',
      html:
        `
        <label class="label-swal">
          Horas:
          <input id="hora-input" type="time" class="form-control" required>
        </label>
        <label class="label-swal">
          Refeição:
          <input id="comida-input" class="form-control" required>
        </label>
        <label class="label-swal">
          Foto:
          <input id="foto-input" type="file" accept="image/png, image/jpeg" class="form-control">
        </label>
        `,
        confirmButtonText:"Salvar a Refeição",
      focusConfirm: false,
      preConfirm: () => {
        const horaValue = document.querySelector('#hora-input') as HTMLInputElement;
        const comidaValue = document.querySelector('#comida-input') as HTMLInputElement;
        const fotoFile = document.querySelector('#foto-input') as HTMLInputElement;
        if(horaValue.value && comidaValue.value){
          if(fotoFile.files[0]){
            const image: File = fotoFile.files[0];
            this.compressImage.compress(image)
            .pipe(take(1))
            .subscribe(compressedImage => {
              console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
              this.getBase64(compressedImage).then(
                (data)=>{
                  this.calendario.dias[index].refeicoes.push( { hora:horaValue.value, prato:comidaValue.value, foto:data as string, } );
                  this.calendario.dias[index].refeicoes = this.calendario.dias[index].refeicoes.sort((a,b) => parseInt(a.hora.replace(/[^0-9]/g,'')) - parseInt(b.hora.replace(/[^0-9]/g,'')));
                  this.service.createOrUpdate(this.calendario).then(()=>{/*this.updateList()*/})
                }
              );
            });
          }else{
            this.calendario.dias[index].refeicoes.push({ hora:horaValue.value, prato:comidaValue.value, foto:''});
            this.calendario.dias[index].refeicoes = this.calendario.dias[index].refeicoes.sort((a,b) => parseInt(a.hora.replace(/[^0-9]/g,'')) - parseInt(b.hora.replace(/[^0-9]/g,'')));
            this.service.createOrUpdate(this.calendario).then(()=>{/*this.updateList()*/})
          }
          
        }
        else{ Swal.showValidationMessage('Preencha todos os campos obrigatórios') }
      }
    })
  }
  deleteRefeicao(indexDia, index){
    this.calendario.dias[indexDia].refeicoes.splice(index, 1);
    this.service.createOrUpdate(this.calendario).then(()=>{/*this.updateList()*/})
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
    this.service.get(this.id).subscribe(e=>{ this.calendario=e; this.isload = true;});
    
  }
  
}

class Dia { dia:string; refeicoes:Refeicao[] }
class Refeicao { hora:string; prato:string; foto?:string; }
