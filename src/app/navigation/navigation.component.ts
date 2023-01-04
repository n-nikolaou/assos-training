import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  titleFilter: string;

  constructor() {this.titleFilter = '';}

  getTitle() {
      //@ts-ignore
      this.titleFilter = (document.getElementById("searchInput").value === undefined) ? '' : document.getElementById("searchInput").value;
  }
}
