import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { PartyBaseDto, PartyService } from 'src/app/apis';
import { CommonPartiesUtils } from 'src/app/services/common-parties-utils.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.page.html',
  styleUrls: ['./events-list.page.scss'],
})
export class EventsListPage implements OnInit {

  @ViewChild('ionContent') ionContent?: IonContent;

  @Input() title?: string;
  @Input() header: { title?: string, subtitle?: string, enableBackButton: boolean; } = { enableBackButton: true };
  @Input() filters: any;

  public parties?: PartyBaseDto[];

  constructor(
    private readonly router: ActivatedRoute,
    private readonly partiesService: PartyService,
    private readonly navCtrl: NavController,
    public readonly partiesUtils: CommonPartiesUtils
  ) { }

  ngOnInit() {
    this.router.queryParams.subscribe(res => {
      this.title = res['title'];
      this.header = { 
        ...this.header, 
        title: res['header'].title, 
        subtitle: res['header'].subtitle 
      };
      this.filters = res['filters'] || undefined;
      this.partiesService.findAll(0, 20, this.filters, undefined, undefined, 'club')
        .subscribe(res => {
          this.parties = res.data;
        });
    });
  }

  // ionViewWillEnter() {
  //   this.partiesService.findAll(0, 20, this.filters, undefined, undefined, 'club').subscribe(res => {
  //     this.parties = res.data;
  //   });
  // }

  goBack() {
    this.navCtrl.back();
  }

  goToEvent(party: PartyBaseDto) {
    this.navCtrl.navigateForward(['event-detail', party.id]);
  }

  goToEventsWeekend() {
    this.ionContent?.scrollToTop(300);
    this.partiesUtils.CommonFilterActions.Weekend();
  }

  goToClubsEventsList() {
    this.ionContent?.scrollToTop(300);
    this.partiesUtils.CommonFilterActions.FavoritesClubs();
  }
}
