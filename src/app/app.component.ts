import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimengModule } from './shared/primeng/primeng.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,PrimengModule],
  providers:[MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lead-time-front';
}
