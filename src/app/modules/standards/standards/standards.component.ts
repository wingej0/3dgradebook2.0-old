import { Component, OnInit } from '@angular/core';
import { StandardsService } from 'src/app/core/services/standards/standards.service';
import { StandardsGroup } from 'src/app/core/models/standards-group';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-standards',
  templateUrl: './standards.component.html',
  styleUrls: ['./standards.component.css']
})
export class StandardsComponent implements OnInit {
  standardsGroups$ = this.standardsService.displayedStandardsGroups$;
  activeGroup;
  groupFormTitle;
  groupForm;

  constructor(
    private standardsService : StandardsService,
    private fb : FormBuilder,
  ) { }

  ngOnInit(): void {
    this.setStandardsGroupForm();
    this.activeGroup = this.fb.group({
      active : [{}],
    })
  }

  setStandardsGroupForm(group? : StandardsGroup) {
    if (group) {
      this.groupFormTitle = "Edit " + group.name;
      this.groupForm = this.fb.group({
        id : [group.id, Validators.required],
        name : [group.name, Validators.required],
        categories : this.fb.array(group.categories),
      })
    } else {
      this.groupFormTitle = "Add a Standards Group";
      this.groupForm = this.fb.group({
        name : ['', Validators.required],
        categories : this.fb.array([]),
      })
    }
  }

  addCategory(category : HTMLInputElement) {
    this.categories.push(new FormControl(category.value));
    category.value = '';
  }

  get categories() {
    return this.groupForm.get('categories') as FormArray;
  }

  updateGroup() {
    let newGroup = this.groupForm.value;
    this.standardsService.createStandardsGroup(newGroup).subscribe(ref => this.standardsService.activeGroupAction.next(ref.key));
  }

  setActive(id) {
    this.standardsService.activeGroupAction.next(id);
  }
}
