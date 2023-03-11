import { Injectable } from '@angular/core';
import { ServiceFirebase } from '../core/servicefirebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Mes } from '../models/tables.model';

@Injectable({
  providedIn: 'root'
})
export class MesService extends ServiceFirebase<Mes> {

  constructor(firestore: AngularFirestore) {
    super(Mes, firestore, 'meses');
  }
}
