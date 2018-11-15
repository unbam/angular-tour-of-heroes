import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Hero } from "./Hero";
import { MessageService } from "./message.service";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes'; // Web APIのURL

  constructor(
      private messageService: MessageService,
      private http: HttpClient
  ) { }

  /**
   * HEROESリストの取得
   * @returns {Observable<Hero[]>}
   */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
    );
  }

  /**
   * 対象Heroの取得
   * @param {number} id ID
   * @returns {Observable<Hero>}
   */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /**
   * 対象Heroの取得(見つからない場合は404を返却)
   * @param {number} id ID
   * @returns {Observable<Hero>}
   */
  getHeroNo404<Data>(id: number): Observable<Hero> {
      const url = `${this.heroesUrl}/?id=${id}`;
      return this.http.get<Hero[]>(url).pipe(
          map(heroes => heroes[0]),
          tap(h => {
              const outcome = h ? 'fetched' : 'did not find';
              this.log(`${outcome} hero id=${id}`);
          }),
          catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /**
   * 追加
   * @param {Hero} hero
   * @returns {Observable<Hero>}
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
        tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
    );
  }

  /**
   * 更新
   * @param {Hero} hero
   * @returns {Observable<any>}
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
        tap(_ => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * 削除
   * @param {Hero | number} hero
   * @returns {Observable<Hero>}
   */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /**
   * 検索
   * @param {string} term
   * @returns {Observable<Hero[]>}
   */
  searchHeroes(term: string): Observable<Hero[]> {

    // 検索文字列がない場合は空の配列を返却
    if(!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        tap(_ => this.log(`found heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /**
   * エラーハンドラ
   * @param {string} operation 失敗した操作の名前
   * @param {T} result observableな結果として返す任意の値
   * @returns {(error: any) => Observable<T>}
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> =>{
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);
      return of(result as T)
    }
  }

  /**
   * ログ出力
   * @param {string} message
   */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
