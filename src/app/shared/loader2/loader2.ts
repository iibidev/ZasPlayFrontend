import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader2',
  imports: [],
  templateUrl: './loader2.html',
  styleUrl: './loader2.css'
})
export class Loader2 {
  @Input() color: string = "#FFF";
}
