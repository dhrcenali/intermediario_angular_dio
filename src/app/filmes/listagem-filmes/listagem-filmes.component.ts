import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FilmesService } from 'src/app/core/filmes.service';
import { ConfigParams } from 'src/app/shared/models/config-params';
import { Filme } from 'src/app/shared/models/filme';


@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {
  readonly semFoto = 'https://www.termoparts.com.br/wp-content/uploads/2017/10/no-image.jpg';
  config: ConfigParams = {
    pagina: 0, 
    limite: 4,

  };
  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  generos: Array<string>;
  

  constructor(private filmesService: FilmesService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.filtrosListagem = this.fb.group({
        texto: [''],
        genero: ['']
      });

    this.filtrosListagem.get('texto').valueChanges
    .pipe(debounceTime(400))
    .subscribe((val: string) =>{
      this.config.pesquisa = val;
      this.restarConsulta();

    })
    this.filtrosListagem.get('genero').valueChanges
    .subscribe((val: string) => {
      this.config.campo = {tipo: 'genero', valor: val };
      this.restarConsulta();
    })

    this.generos = ['Ação', 'Romance', 'Aventura', 'Terror', 'Ficção Cientifica', 'Comedia', 'Drama'];
    this.listarFimes();
  }

  onScroll(): void {
    this.listarFimes();
  }

  abrir(id: number): void {
    this.router.navigateByUrl('filmes/' + id)
  }
  
  private listarFimes(): void{
    this.config.pagina++;
     this.filmesService.listar(this.config)
     .subscribe((filmes: Filme[]) => this.filmes.push(...filmes));
  }
  private restarConsulta(): void {
    this.config.pagina= 0;
    this.filmes= [];
    this.listarFimes();
  }
}
