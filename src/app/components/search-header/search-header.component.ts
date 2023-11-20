import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  public filterType: 'all' | 'clubs' | 'parties' = 'all';

  constructor(
    private readonly clubsService: ClubService,
    private readonly partiesService: PartyService,
    private readonly usersService: UserService,
  ) { }

  ngOnInit() { }

  filter(type: 'all' | 'clubs' | 'parties') {
    this.filterType = type;
    this.search();
  }

  onChange($event: any) {
    this.searchTerm = $event.target.value;
    setTimeout(() => {
      const el: HTMLDivElement = this.header?.el;
      const headerHeight = el ? el.offsetTop + el.clientHeight || 5 : 5;
      if (this.wrapper) {
        this.wrapper.nativeElement.style.top = `${headerHeight}px`;
      }
      this.headerHeight = headerHeight;
    }, 100);
    this.search();
  }

  search() {
    this.parties = [];
    this.clubs = [];
    if (['all', 'clubs'].includes(this.filterType)) {
      this.clubsService.findAll(0, 10, JSON.stringify({ name: { $containsIgnore: this.searchTerm } }), undefined, undefined, 'address')
        .subscribe(clubs => {
          this.clubs = clubs.data;
        });
    }
    if (['all', 'parties'].includes(this.filterType)) {
      this.partiesService.findAll(0, 10, JSON.stringify({ title: { $containsIgnore: this.searchTerm } }), undefined, undefined, 'club')
        .subscribe(parties => {
          this.parties = parties.data;
        });
    }
  }

}
