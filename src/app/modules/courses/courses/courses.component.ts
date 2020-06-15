import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from 'src/app/core/services/courses/courses.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Course } from 'src/app/core/models/course';
import { SubSink } from 'subsink';
import { StandardsGroup } from 'src/app/core/models/standards-group';
import { StandardsService } from 'src/app/core/services/standards/standards.service';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses$ : Observable<Course[]> = this.coursesService.displayedCourses$;
  cData$ = combineLatest([
      this.auth.user$,
      this.courses$,
      this.standardsService.standardsGroups$
    ]).pipe(map(([user, courses, standards]) => 
      ({user, courses, standards})));

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
  
  // Properties for pagination
  itemsPerPage : number = 5;
  start : number = 0;
  end : number = 5;
  page : number = 1;

  constructor(
    private auth : AuthService,
    private coursesService : CoursesService,
    private standardsService : StandardsService,
    private fb : FormBuilder,
  ) { }

  ngOnInit(): void {
    this.setForm();
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

  updateCourse() {
    if (this.courseForm.value.id) {
      let id = this.courseForm.value.id;
      let updatedCourse = this.courseForm.value;
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

  // Pagination
  setItemsPerPage(itemsPerPage : number, coursesLength) {
    if (!isNaN(itemsPerPage)) {
      this.itemsPerPage = itemsPerPage;
      this.end = this.start + this.itemsPerPage;
      if (itemsPerPage < coursesLength && coursesLength > ((this.page -1) * itemsPerPage)) {
        this.changePage(this.page);
      } else {
        this.changePage(Math.ceil(coursesLength / itemsPerPage));
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
