import { Component, OnInit } from '@angular/core';
import { StandardsService } from 'src/app/core/services/standards/standards.service';
import { StandardsGroup } from 'src/app/core/models/standards-group';

@Component({
  selector: 'app-standards',
  templateUrl: './standards.component.html',
  styleUrls: ['./standards.component.css']
})
export class StandardsComponent implements OnInit {
  standardsGroups : StandardsGroup[];
  activeGroup;

  constructor(
    private standardsService : StandardsService
  ) { }

  ngOnInit(): void {
    this.getStandardsGroups();
  }

  getStandardsGroups() {
    this.standardsService.getStandardsGroups()
      .subscribe(groups => {
        this.standardsGroups = groups;
      })
  }

}
