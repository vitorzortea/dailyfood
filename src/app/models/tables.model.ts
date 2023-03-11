import { Model } from '../core/model';

export class Mes extends Model {
  nome: string;
  ano: string;
  calendario: string;
}

export class Calendario extends Model {
  nome: string;
  ano: string;
  dias: [
    {
      nome:string;
      refeicoes: any[]
    }
  ];
}
