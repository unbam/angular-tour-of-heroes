import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

import { Hero } from "../Hero";
import { HeroService } from "../hero.service";

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroes$ = this.searchTerms.pipe(
        // キーストローク後に300ミリ待機
        debounceTime(300),

        // 直前と同じワードの場合は無視
        distinctUntilChanged(),

        // 検索ワードが変更するたびに、新しい検索Observableに切り替え
        switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

  /**
   * 検索
   * @param {string} term　検索ワード
   */
  search(term: string): void {
    // Observableに値をpushする
    this.searchTerms.next(term);
  }
}
