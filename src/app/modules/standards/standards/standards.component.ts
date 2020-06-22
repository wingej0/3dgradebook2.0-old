import { Component, OnInit } from '@angular/core';
import { StandardsService } from 'src/app/core/services/standards/standards.service';
import { StandardsGroup } from 'src/app/core/models/standards-group';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
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
  filterText : string;

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
        categories : this.fb.array(group.categories, Validators.required),
      })
    } else {
      this.groupFormTitle = "Add a Standards Group";
      this.groupForm = this.fb.group({
        name : ['', Validators.required],
        categories : this.fb.array([], [Validators.required]),
      })
    }
  }

  setStandardsForm(standard? : Standard) {
    if (standard) {
      this.standardsFormTitle = "Edit " + standard.name;
      this.standardsForm = this.fb.group({
        id : [standard.id],
        category : [standard.category, Validators.required],
        name : [standard.name, Validators.required],
        description : [standard.description, Validators.required],
        essential : [standard.essential]
      })
    } else {
      this.standardsFormTitle = "Add a Standard";
      this.standardsForm = this.fb.group({
        category : ['', Validators.required],
        name : ['', Validators.required],
        description : ['', Validators.required],
        essential : [false]
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

  deleteGroup(group, standards?) {
    let result = confirm("Are you sure you want to delete '" + group.name + "'?");
    if (result) {
      this.standardsService.activeGroupAction.next(null);
      if (standards) {
        for (let sObj of standards) {
          for (let standard of sObj.standards) {
            this.standardsService.deleteStandard(standard).subscribe();
          }
        }
      }
      return this.standardsService.deleteStandardsGroup(group)
        .subscribe(() => {
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

  toggleEssential(standard) {
    let id = standard.id;
    let essential = standard.essential;
    return this.standardsService.updateStandard({essential : essential}, id)
        .subscribe();
  }

  updateStandard(group) {
    let standard = this.standardsForm.value;
    if (standard.id) {
      let id = standard.id;
      delete standard.id;
      return this.standardsService.updateStandard(standard, id)
        .subscribe();
    } else {
      standard.group = group;
      this.standardsService.createStandard(standard).subscribe();
    }
  }

  deleteStandard(standard) {
    let result = confirm("Are you sure you want to delete '" + standard.name + "'?");
    if (result) {
      return this.standardsService.deleteStandard(standard)
        .subscribe(() => {
          return;
        },
        error => {
          alert(error.message);
        })
    }
  }
}
