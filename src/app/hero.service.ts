import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { Hero } from "./Hero";
import { HEROES } from "./mock-heroes";
import { MessageService } from "./message.service";

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService) { }

  /**
   * HEROESリストの取得
   * @returns {Observable<Hero[]>}
   */
  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }

  /**
   * 対象Heroの取得
   * @param {number} id ID
   * @returns {Observable<Hero>}
   */
  getHero(id: number): Observable<Hero> {
    this.messageService.add('HeroService: fetched hero');
    return of(HEROES.find(hero => hero.id === id));
  }
}
