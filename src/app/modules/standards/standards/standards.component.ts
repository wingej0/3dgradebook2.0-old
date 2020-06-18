import { Component, OnInit } from '@angular/core';
import { StandardsService } from 'src/app/core/services/standards/standards.service';
import { StandardsGroup } from 'src/app/core/models/standards-group';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { error } from 'console';
import { Standard } from 'src/app/core/models/standard';

@Component({
  selector: 'app-standards',
  templateUrl: './standards.component.html',
  styleUrls: ['./standards.component.css']
})
export class StandardsComponent implements OnInit {
  standardsGroups$ = this.standardsService.displayedStandardsGroups$;
  groupFormTitle;
  groupForm;
  standardsFormTitle;
  standardsForm;

  constructor(
    private standardsService : StandardsService,
    private fb : FormBuilder,
  ) { }

  ngOnInit(): void {
    this.setStandardsGroupForm();
    this.setStandardsForm();
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

  setStandardsForm(standard? : Standard) {
    this.standardsFormTitle = "Add a Standard";
    this.standardsForm = this.fb.group({
      category : ['', Validators.required],
      name : ['', Validators.required],
      description : ['', Validators.required],
      essential : [false]
    })
  }

  get categories() {
    return this.groupForm.get('categories') as FormArray;
  }

  addCategory(category : HTMLInputElement) {
    this.categories.push(new FormControl(category.value));
    category.value = '';
  }

  moveCategories(o, n) {
    let category = this.categories.at(o);
    this.categories.removeAt(o);
    this.categories.insert(n-1, category);
  }

  editCategories(index, newCat) {
    let oldCat = this.categories[index];
    this.categories.value[index] = newCat; 
  }

  deleteCategories(index) {
    this.categories.removeAt(index);
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

  updateStandard(group) {
    let standard = this.standardsForm.value;
    standard.group = group;
    this.standardsService.createStandard(standard).subscribe();
  }
}
