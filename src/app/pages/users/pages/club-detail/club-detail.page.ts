import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AttachmentBaseDto, ClubBaseDto, ClubService, PartyBaseDto, PartyService } from 'src/app/apis';

@Component({
  selector: 'app-club-detail',
  templateUrl: './club-detail.page.html',
  styleUrls: ['./club-detail.page.scss'],
})
export class ClubDetailPage implements OnInit {

  public parties?: PartyBaseDto[];
  public club?: ClubBaseDto;
  public profile?: AttachmentBaseDto;
  public covers?: AttachmentBaseDto[];

  constructor(
    private route: ActivatedRoute,
    private readonly navCtrl: NavController,
    private readonly partiesService: PartyService,
    private readonly clubsService: ClubService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.clubsService.findOne(res['id'], undefined, 'address').subscribe(res => {
        this.club = res.data;
        const [profile, ...covers] = this.club.covers;
        this.profile = profile;
        this.covers = covers;
      });
      this.partiesService.findAll(0, 20, JSON.stringify({ club: { id: res['id'] } })).subscribe(res => {
        this.parties = res.data;
      });
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
