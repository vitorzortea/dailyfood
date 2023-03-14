import { Injectable } from '@angular/core';
import { ServiceFirebase } from '../core/servicefirebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Refeicoes } from '../models/tables.model';

@Injectable({
  providedIn: 'root'
})
export class RefeicoesService extends ServiceFirebase<Refeicoes> {

  constructor(firestore: AngularFirestore) {
    super(Refeicoes, firestore, 'refeicoes');
  }
}
