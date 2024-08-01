import { Component } from '@angular/core';
import { LayoutService } from './shared/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'easy-cure';
  constructor(public layoutService: LayoutService) {}
}
