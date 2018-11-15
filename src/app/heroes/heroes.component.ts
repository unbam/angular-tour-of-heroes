import { Component, OnInit } from '@angular/core';
import { Hero } from "../Hero";
import { HeroService } from "../hero.service";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    // リスト取得
    this.getHeroes();
  }

  /**
   * リスト取得
   */
  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  /**
   * 追加
   * @param {string} name
   */
  add(name: string): void {
    name = name.trim();

    if(!name) {
      return;
    }

    // 追加
    this.heroService.addHero({ name } as Hero).subscribe((
        hero => this.heroes.push(hero)
    ));
  }

  /**
   * 削除
   * @param {Hero} hero
   */
  delete(hero: Hero): void {
      this.heroes = this.heroes.filter(h => h !== hero);
      this.heroService.deleteHero(hero).subscribe();
  }
}
