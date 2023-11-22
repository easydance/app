import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { DateTime } from 'luxon';
import { ClubBaseDto, ClubService, PartyBaseDto, PartyService, UserBaseDto, UserService } from 'src/app/apis';

@Component({
  selector: 'search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss'],
})
export class SearchHeaderComponent implements OnInit {

  @ViewChild('header') header?: any;
  @ViewChild('wrapper') wrapper?: any;

  public searchTerm: string = '';
  public headerHeight: number = 5;

  public clubs: ClubBaseDto[] = [];
  public parties: PartyBaseDto[] = [];
  public users: UserBaseDto[] = [];

  public filterType: 'all' | 'clubs' | 'parties' | 'users' = 'all';

  constructor(
    private readonly clubsService: ClubService,
    private readonly partiesService: PartyService,
    private readonly usersService: UserService,
  ) { }

  ngOnInit() { }

  filter(type: 'all' | 'clubs' | 'parties' | 'users') {
    this.filterType = type;
    this.search();
  }

  async onChange($event: any) {
    this.searchTerm = $event.target.value;
    const el: HTMLDivElement = this.header?.el;
    const headerHeight = el ? el.offsetTop + el.clientHeight || 5 : 5;
    if (this.wrapper) {
      this.wrapper.nativeElement.style.top = `${headerHeight}px`;
    }
    this.headerHeight = headerHeight;
    if (!this.searchTerm) {
      this.wrapper.nativeElement.style.display = 'none';
      Keyboard.hide();
    } else {
      this.wrapper.nativeElement.style.display = 'block';
    }
    this.search();
  }

  search() {
    this.parties = [];
    this.clubs = [];
    this.users = [];
    if (['all', 'clubs'].includes(this.filterType)) {
      this.clubsService.findAll(0, 10, JSON.stringify({ name: { $containsIgnore: this.searchTerm } }), undefined, undefined, 'address')
        .subscribe(clubs => {
          this.clubs = clubs.data;
        });
    }
    if (['all', 'parties'].includes(this.filterType)) {
      this.partiesService.findAll(0, 10, JSON.stringify({ title: { $containsIgnore: this.searchTerm }, to: { $gte: DateTime.now().toISO() } }), undefined, undefined, 'club')
        .subscribe(parties => {
          this.parties = parties.data;
        });
    }
    if (['all', 'users'].includes(this.filterType)) {
      this.usersService.findAll(0, 10, JSON.stringify([
        { email: { $containsIgnore: this.searchTerm } },
        { socials: { instagram: { username: { $containsIgnore: this.searchTerm } } } },
        { socials: { twitter: { username: { $containsIgnore: this.searchTerm } } } },
        { socials: { facebook: { username: { $containsIgnore: this.searchTerm } } } },
      ]), undefined, undefined, 'club')
        .subscribe(users => {
          this.users = users.data;
        });
    }
  }


  async onClear() {
    await Keyboard.hide();
  }
}
