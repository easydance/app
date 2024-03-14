import { AfterViewChecked, AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ClusterIconStyle, GoogleMap, MarkerClustererOptions } from '@angular/google-maps';
import { IonModal, NavController } from '@ionic/angular';
import { DateTime } from 'luxon';
// import { GoogleMap, LatLngBounds } from '@capacitor/google-maps';
import { Subject, debounceTime, lastValueFrom } from 'rxjs';
import { BASE_PATH, ClubBaseDto, ClubService, PartyBaseDto, PartyService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { CommonPartiesUtils } from 'src/app/services/common-parties-utils.service';
import { customMapStyle } from 'src/app/utils/google-maps.utils';

export type SearchType = 'parties' | 'clubs';

@Component({
  selector: 'map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewChecked {

  @ViewChild('map') map?: GoogleMap;

  @ViewChild('eventsModal') eventsModal?: IonModal;
  @ViewChild('clubModal') clubModal?: IonModal;
  @ViewChild('detailModal') detailModal?: IonModal;

  private debounceMarkers = new Subject<google.maps.LatLngBounds>();
  private debounceMarkers$ = this.debounceMarkers.asObservable().pipe(debounceTime(500));
  private currentDate: Date = new Date();
  private mapReady: boolean = false;
  // private map?: GoogleMap;
  public parties: PartyBaseDto[] = [];
  public clubs: ClubBaseDto[] = [];
  public selectedParties?: PartyBaseDto[];
  public selectedClub?: ClubBaseDto;
  public city?: string = this.authManager.currentCity;
  public searchType: SearchType = 'parties';
  public partyDetail?: PartyBaseDto;

  public itemOptions = { onItemClick: this.goto.bind(this) };

  options: google.maps.MapOptions = {
    panControl: false,
    zoomControl: false,
    scaleControl: false,
    rotateControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    styles: customMapStyle,
    backgroundColor: 'black',
    maxZoom: 18,
    minZoom: 8
  };
  center?: {
    lat: number;
    lng: number;
  };
  filter: any = {
    ...this.partiesUtils.Filters().InDay(new Date())
  };
  currentBounds: google.maps.LatLngBounds | null = null;
  date: string = DateTime.now().toFormat('dd LLL', { locale: 'it-IT' });

  markerIcon: google.maps.Icon = {
    url: this.basePath + '/marker.png',
  };
  clusterOptions: MarkerClustererOptions = {
    styles: [{
      height: 36,
      width: 36,
      url: this.basePath + '/marker.png',
      anchorIcon: [18, 18],
      anchorText: [4, -5],
      textColor: 'white',
      textSize: 14,
      fontFamily: 'Space Grotesk'
    }]
  };
  partiesWeekend: any;

  constructor(
    public authManager: AuthManagerService,
    private readonly partiesService: PartyService,
    private readonly clubsService: ClubService,
    private navCtrl: NavController,
    public partiesUtils: CommonPartiesUtils,
    @Inject(BASE_PATH) public basePath: string | string[]
  ) {
    this.authManager.geocoding$.subscribe(res => {
      this.city = this.authManager.currentCity;
      const lat = this.authManager.geocoding?.geometry.location.lat();
      const lng = this.authManager.geocoding?.geometry.location.lng();
      if (lat != undefined && lng !== undefined) {
        this.center = { lat, lng };
      }
    });

    this.debounceMarkers$.subscribe(res => {
      this.addMarkersFromAPI(res);
    });
  }
  ionViewWillLeave() {
    this.eventsModal?.dismiss();
    this.clubModal?.dismiss();
    this.detailModal?.dismiss();
  }

  ngAfterViewChecked(): void {
    // if (!this.mapReady && document.getElementById('map')) {
    //   this.initMap();
    // }
    const mapDiv = document.querySelector<HTMLDivElement>('div[aria-label="Mappa"]');
    if (mapDiv && mapDiv.style.background != 'black') {
      mapDiv.style.background = '#2B2B2B';
      const btns = document.querySelector('.gmnoprint');
      if (btns && btns.parentElement) btns.parentElement.style.display = 'none';
    }
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    // document.body.style.background = 'transparent';
    const lat = this.authManager.geocoding?.geometry.location.lat();
    const lng = this.authManager.geocoding?.geometry.location.lng();
    if (lat != undefined && lng !== undefined) {
      this.center = { lat, lng };
    }
  }

  changeSearchType(searchType: SearchType) {
    this.searchType = searchType;
    if (this.searchType == 'clubs') {
      this.parties = [];
    } else {
      this.clubs = [];
    }
    if (this.currentBounds) {
      this.addMarkersFromAPI(this.currentBounds);
    }
  }

  onBoundsChanged($event: any, map: GoogleMap) {
    this.currentBounds = map.getBounds();
    if (this.currentBounds) {
      this.debounceMarkers.next(this.currentBounds);
    }
  }

  async addMarkersFromAPI(bounds: google.maps.LatLngBounds) {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const neLat = ne.lat();
    const neLng = ne.lng();
    const swLat = sw.lat();
    const swLng = sw.lng();
    this.filter = {
      ...this.filter,
      id: { $not: { $in: this.parties.map(p => p.id) } },
      address: {
        lat: { $between: [swLat, neLat] },
        lng: { $between: [swLng, neLng] },
      }
    };
    if (this.searchType == 'parties') {
      const parties = await lastValueFrom(
        this.partiesService.findAll(0, 1000, JSON.stringify(this.filter), undefined, undefined, 'club.address,address')
      );
      if (parties.data.length > 0) {
        this.parties = Array.from(new Set([...this.parties, ...parties.data.filter(p => !this.parties.map(p1 => p1.id).includes(p.id))])).map(p => ({
          ...p,
          from: new Date(p.from).getTime() < this.currentDate.getTime()
            ? DateTime.fromJSDate(this.currentDate).set({ hour: new Date(p.from).getHours(), minute: new Date(p.from).getMinutes() }).toISO()!
            : p.from
        }));
      }
    }
    if (this.searchType == 'clubs') {
      const clubs = await lastValueFrom(
        this.clubsService.findAll(0, 1000, JSON.stringify({
          id: { $not: { $in: this.clubs.map(p => p.id) } },
          address: {
            lat: { $between: [swLat, neLat] },
            lng: { $between: [swLng, neLng] },
          }
        }), undefined, undefined, 'address')
      );
      if (clubs.data.length > 0) {
        this.clubs = Array.from(new Set([...this.clubs, ...clubs.data.filter(p => !this.parties.map(p1 => p1.id).includes(p.id))]));
      }
    }
  }

  onChangeDate($event: any, modal: IonModal) {
    console.log($event);
    if (this.currentBounds) {
      this.currentDate = new Date($event.detail.value);
      const date = DateTime.fromJSDate(new Date($event.detail.value));
      // if (date.toFormat('dd/LL/yyyy') == DateTime.now().toFormat('dd/LL/yyyy')) {
      //   this.date = 'OGGI';
      // } else if (date.toFormat('dd/LL/yyyy') == DateTime.now().plus({ days: 1 }).toFormat('dd/LL/yyyy')) {
      //   this.date = 'DOMANI';
      // } else {
      this.date = date.toFormat('dd LLL', { locale: 'it-IT' });
      // }
      this.filter = {
        ...this.filter,
        ...this.partiesUtils.Filters().InDay(new Date($event.detail.value))
      };
      this.parties = [];
      this.addMarkersFromAPI(this.currentBounds);
      modal.dismiss();
    }
  }

  showEvent(party: PartyBaseDto) {
    this.partyDetail = party;
    this.detailModal?.present();
  }

  showEvents(cluster: any) {
    this.partyDetail = undefined;
    const ids = cluster.getMarkers().map((m: google.maps.Marker) => parseInt(m.get('title')));
    this.selectedParties = this.parties.filter(p => ids.includes(p.id));
    this.eventsModal?.present();
  }

  fake() { }

  async showClub(club: ClubBaseDto) {
    this.selectedClub = club;
    this.partiesWeekend = await this.partiesService.findAll(0, 5, JSON.stringify({
      ...this.partiesUtils.Filters().Weekend,
      club: {
        id: club.id
      }
    }));
    this.clubModal?.present();
  }


  goto(party: PartyBaseDto) {
    this.navCtrl.navigateForward('/event-detail/' + party.id, {
      queryParams: {
        forcedDate: DateTime.fromJSDate(this.currentDate).set({ hour: new Date(party.from).getHours(), minute: new Date(party.from).getMinutes() }).toISO()!
      }
    });
  }

  gotoMyposition() {
    if (this.map && this.authManager.geolocation) {
      const { coords } = this.authManager.geolocation;
      this.map.panTo({
        lat: coords.latitude,
        lng: coords.longitude
      });
      this.city = this.authManager.currentCity;
    }
  }

}
