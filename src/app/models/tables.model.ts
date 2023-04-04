import { Model } from '../core/model';

export class Mes extends Model {
  nome: string;
  ano: string;
  calendario: string;
}

export class Calendario extends Model {
  nome: string;
  ano: string;
  observacao: string;
  dias: [
    {
      nome:string;
      refeicoes: any[]
    }
  ];
}

export class Refeicoes extends Model {
  hora: string;
  prato: string;
  foto?: any ;
}

