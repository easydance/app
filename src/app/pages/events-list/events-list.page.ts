import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PartyBaseDto, PartyService } from 'src/app/apis';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.page.html',
  styleUrls: ['./events-list.page.scss'],
})
export class EventsListPage implements OnInit {

  @Input() title?: string;
  @Input() header: { title?: string, subtitle?: string, enableBackButton: boolean; } = { enableBackButton: true };

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
    });
  }

  ionViewWillEnter() {
    this.partiesService.findAll(0, 20, undefined, undefined, undefined, 'club').subscribe(res => {
      this.parties = res.data;
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  goToEvent(party: PartyBaseDto) {
    this.navCtrl.navigateForward(['event-detail', party.id]);
  }
}
