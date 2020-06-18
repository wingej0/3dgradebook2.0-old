import { Component, OnInit } from '@angular/core';
import { StandardsService } from 'src/app/core/services/standards/standards.service';
import { StandardsGroup } from 'src/app/core/models/standards-group';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-standards',
  templateUrl: './standards.component.html',
  styleUrls: ['./standards.component.css']
})
export class StandardsComponent implements OnInit {
  standardsGroups$ = this.standardsService.displayedStandardsGroups$;
  groupFormTitle;
  groupForm;

  constructor(
    private standardsService : StandardsService,
    private fb : FormBuilder,
  ) { }

  ngOnInit(): void {
    this.setStandardsGroupForm();
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

  get categories() {
    return this.groupForm.get('categories') as FormArray;
  }

  addCategory(category : HTMLInputElement) {
    this.categories.push(new FormControl(category.value));
    category.value = '';
  }

  updateGroup() {
    let newGroup = this.groupForm.value;
    if (newGroup.id) {
      let id = newGroup.id;
      delete newGroup.id;
      return this.standardsService.updateStandardsGroup(newGroup, id)
          .subscribe();
    } else {
      return this.standardsService.createStandardsGroup(newGroup)
          .subscribe(ref => this.standardsService.activeGroupAction.next(ref.key));
    }
  }

  deleteGroup(group) {
    let result = confirm("Are you sure you want to delete '" + group.name + "'?");
    if (result) {
      return this.standardsService.deleteStandardsGroup(group)
        .subscribe(() => {
          this.standardsService.activeGroupAction.next('');
          return;
        },
        error => {
          alert(error.message);
        }) 
    }
  } 

  setActive(id) {
    this.standardsService.activeGroupAction.next(id);
  }
}
