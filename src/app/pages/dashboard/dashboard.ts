import { Component, OnDestroy, OnInit } from '@angular/core';
import { Veiculo } from '../../models/veiculo.model';
import { VehicleData } from '../../models/vehicle-data.model';
import { Vehicle } from '../../services/vehicles';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {

  vehicles: Veiculo[] = [];
  selecionado: Veiculo | null = null;

  // ---- Passo 11: tabela do rodapé ----
  vehicleData: VehicleData | null = null;
  mensagemBusca = '';

  private busca$ = new Subject<string>();
  private buscaSubscription?: Subscription;

  constructor(private vehicle: Vehicle, private auth: Auth) {}

  logout(): void {
    this.auth.logout();
  }

  ngOnInit(): void {
    this.vehicle.getVeiculos().subscribe(
      response => {
        this.vehicles = response.vehicles;
      }
    );

    this.buscaSubscription = this.busca$
      .pipe(
        map(valor => valor.trim()),
        debounceTime(400),
        distinctUntilChanged(),
        filter(codigo => codigo.length > 0),
        switchMap(codigo =>
          this.vehicle.postVehicleData(codigo).pipe(
            map(dado => ({ ...dado, vin: codigo })),
            catchError(() => {
              this.mensagemBusca = 'Código VIN não encontrado!';
              return of(null);
            })
          )
        )
      )
      .subscribe(dado => {
        this.vehicleData = dado;
        if (dado) {
          this.mensagemBusca = '';
        }
      });
  }

  ngOnDestroy(): void {
    this.buscaSubscription?.unsubscribe();
  }

  buscarPorCodigo(valor: string): void {
    const codigo = valor.trim();
    if (!codigo) {
      this.vehicleData = null;
      this.mensagemBusca = '';
      return;
    }
    this.busca$.next(codigo);
  }

  veiculoSelecionado(event:Event):void{
    const idSelecionado = (event.target as HTMLSelectElement).value;


    if(idSelecionado){
      this.selecionado = this.vehicles.find(v => v.id == Number(idSelecionado)) || null;
    } else {
      this.selecionado = null;
    }
  }
}
