import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { PartyBaseDto, PartyService } from 'src/app/apis';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.page.html',
  styleUrls: ['./events-list.page.scss'],
})
export class EventsListPage implements OnInit {

  @Input() title?: string;
  @Input() header: { title?: string, subtitle?: string, enableBackButton: boolean; } = { enableBackButton: true };
  @Input() filters: any;

  public parties?: PartyBaseDto[];

  constructor(
    private readonly router: ActivatedRoute,
    private readonly partiesService: PartyService,
    private readonly navCtrl: NavController
  ) { }

  ngOnInit() {
    this.router.queryParams.subscribe(res => {
      this.title = res['title'];
      this.header = { ...this.header, title: res['header'].title, subtitle: res['header'].subtitle };
      this.filters = res['filters'] || undefined;
      this.partiesService.findAll(0, 20, this.filters, undefined, undefined, 'club').subscribe(res => {
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
    const dayOfWeek = (new Date().getDay() - 1 + 7) % 7;
    const dayToFriday = dayOfWeek - 4;
    let from = DateTime.now();
    if (dayToFriday < 0) from = DateTime.now().startOf('day').plus({ days: Math.abs(dayToFriday) });
    let to = DateTime.fromMillis(from.toMillis()).plus({ days: 2 }).endOf('day');

    this.navCtrl.navigateForward('/events-list', {
      queryParams: {
        title: 'Eventi di questo weekend',
        header: {
          title: 'ven - dom',
          subtitle: 'Eventi'
        },
        filters: JSON.stringify({
          from: {
            $lte: from.toISO()
          },
          to: {
            $gte: to.toISO()
          }
        })
      }
    });
  }

  goToClubsEventsList() {

  }
}
