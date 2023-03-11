import { Injectable } from '@angular/core';
import { ServiceFirebase } from '../core/servicefirebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Calendario } from '../models/tables.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService extends ServiceFirebase<Calendario> {

  constructor(firestore: AngularFirestore) {
    super(Calendario, firestore, 'calendarios');
  }
}
