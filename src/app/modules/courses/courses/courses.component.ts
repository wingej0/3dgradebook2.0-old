import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from 'src/app/core/services/courses/courses.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Course } from 'src/app/core/models/course';
import { SubSink } from 'subsink';
import { StandardsGroup } from 'src/app/core/models/standards-group';
import { StandardsService } from 'src/app/core/services/standards/standards.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  
  // Properties for ngIf statements and filtering
  import : string = sessionStorage.getItem("import");
  loader : boolean = true;
  showActive : boolean = true;
  sortBy : string = "section";
  filterText : string;

  // Form properties
  formTitle : string;
  courseForm;

  // Async data
  courses : Course[];
  standards : StandardsGroup[];
  
  // Properties for pagination
  itemsPerPage : number = 5;
  start : number = 0;
  end : number = 5;
  page : number = 1;

  constructor(
    private coursesService : CoursesService,
    private standardsService : StandardsService,
    private fb : FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getCourses();
    this.setForm();
    this.getStandards();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setForm(course? : Course) {
    if (course) {
      this.formTitle = 'Edit ' + course.name;
      this.courseForm = this.fb.group({
        id : [course.id],
        name : [course.name, Validators.required],
        section : [course.section, Validators.required],
        standardsID : [course.standardsID],
        active : [course.active]
      });
    } else {
      this.formTitle = 'Add a Course';
      this.courseForm = this.fb.group({
        name : ['', Validators.required],
        section : ['', Validators.required],
        standardsID : [''],
        active : [true],
    });
    }
  }

  getCourses() {
    this.subs.add(
      this.coursesService.getCourses(this.sortBy)
      .subscribe(courses => {
        if (this.showActive) {
          this.courses = courses.filter(course => course.active);
          this.loader = false;
        } else {
          this.courses = courses;
          this.loader = false;
        }
      },
      error => {
        alert(error.message);
      })
    )
  }

  getStandards() {
    this.subs.add(
      this.standardsService.getStandardsGroups()
        .subscribe(standards => {
          this.standards = standards;
        })
    )
  }

  updateCourse() {
    if (this.courseForm.value.id) {
      let id = this.courseForm.value.id;
      let updatedCourse = this.courseForm.value;
      // Add standardsName to object before saving
      if (this.courseForm.value.standardsID) {
        let newStandardsID = this.courseForm.value.standardsID;
        let newStandardsName = this.standards.find(standards => standards.id == newStandardsID).name;
        updatedCourse.standardsName = newStandardsName;
      };
      // Delete the id field from the object before saving
      delete updatedCourse.id;
      this.subs.add(
        this.coursesService.updateCourse(updatedCourse, id)
        .subscribe(() => {
          this.setForm()
        },
        error => {
          alert(error.message);
        })
      )
    } else {
      let newCourse = this.courseForm.value;
      // Add standardsName to object before saving
      if (this.courseForm.value.standardsID) {
        let newStandardsID = this.courseForm.value.standardsID;
        let newStandardsName = this.standards.find(standards => standards.id == newStandardsID).name;
        newCourse.standardsName = newStandardsName;
      };
      this.subs.add(
        this.coursesService.createCourse(newCourse)
        .subscribe(() => {
          this.setForm()
        },
        error => {
          alert(error.message);
        })
      ) 
    }
  }

  deleteCourse(course) {
    let result = confirm("Are you sure you want to delete '" + course.name + " | " + course.section + "'?");
    if (result) {
      return this.subs.add(
        this.coursesService.deleteCourse(course)
        .subscribe(() => {
          return;
        },
        error => {
          alert(error.message);
        })
      )
    }
  }

  archiveToggle(course) {
    let id = course.id;
    let active = {
      active : !course.active,
    };
    this.subs.add(
      this.coursesService.updateCourse(active, id)
      .subscribe(() => {
        return;
      },
      error => {
        alert(error.message);
      })
    )
  }

  setSortBy(sortHeader : string) {
    this.sortBy = sortHeader;
    this.getCourses();
  }

  // Pagination
  setItemsPerPage(itemsPerPage : number) {
    if (!isNaN(itemsPerPage)) {
      this.itemsPerPage = itemsPerPage;
      this.end = this.start + this.itemsPerPage;
      if (itemsPerPage < this.courses.length && this.courses.length > ((this.page -1) * itemsPerPage)) {
        this.changePage(this.page);
      } else {
        this.changePage(Math.ceil(this.courses.length / itemsPerPage));
      }
    } else {
      this.itemsPerPage = this.itemsPerPage;
    } 
  }

  changePage(page) {
    this.page = page;
    this.start = ((page -1) * this.itemsPerPage);
    this.end = (this.start + this.itemsPerPage);
  }
}
