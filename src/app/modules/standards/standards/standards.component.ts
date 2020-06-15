import { Component, OnInit } from '@angular/core';
import { StandardsService } from 'src/app/core/services/standards/standards.service';
import { StandardsGroup } from 'src/app/core/models/standards-group';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-standards',
  templateUrl: './standards.component.html',
  styleUrls: ['./standards.component.css']
})
export class StandardsComponent implements OnInit {
  standardsGroups$ : Observable<StandardsGroup[]> = this.standardsService.standardsGroups$;
  activeGroup;

  constructor(
    private standardsService : StandardsService
  ) { }

  ngOnInit(): void {
    
  }
}
