import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/core/services/courses/courses.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Course } from 'src/app/core/models/course';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  import : string = sessionStorage.getItem("import");
  loader : boolean = true;
  formTitle : string;
  courseForm;
  courses : Course[];
  standards;
  showActive : boolean = true;
  sortBy : string = "section";
  filterText : string;
  
  // Properties for pagination
  itemsPerPage : number = 5;
  start : number = 0;
  end : number = 5;
  page : number = 1;

  constructor(
    private coursesService : CoursesService,
    private fb : FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getCourses();
    this.setForm();
    this.standards = this.getStandards();
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
      this.coursesService.updateCourse(updatedCourse, id)
        .subscribe(() => {
          this.setForm()
        },
        error => {
          alert(error.message);
        });
    } else {
      let newCourse = this.courseForm.value;
      // Add standardsName to object before saving
      if (this.courseForm.value.standardsID) {
        let newStandardsID = this.courseForm.value.standardsID;
        let newStandardsName = this.standards.find(standards => standards.id == newStandardsID).name;
        newCourse.standardsName = newStandardsName;
      };
      this.coursesService.createCourse(newCourse)
        .subscribe(() => {
          this.setForm()
        },
        error => {
          alert(error.message);
        });
    }
  }

  deleteCourse(course) {
    let result = confirm("Are you sure you want to delete '" + course.name + " | " + course.section + "'?");
    if (result) {
      return this.coursesService.deleteCourse(course)
        .subscribe(() => {
          return;
        },
        error => {
          alert(error.message);
        });
    }
  }

  archiveToggle(course) {
    let id = course.id;
    let active = {
      active : !course.active,
    };
    this.coursesService.updateCourse(active, id)
      .subscribe(() => {
        return;
      },
      error => {
        alert(error.message);
      });
  }

  getStandards() {
    return [
      { id: '1', name: 'order 1' },
      { id: '2', name: 'order 2' },
      { id: '3', name: 'order 3' },
      { id: '4', name: 'order 4' }
    ];
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
