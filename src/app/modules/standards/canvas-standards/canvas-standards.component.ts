import { Component, OnInit } from '@angular/core';
import { CanvasStandardsService } from 'src/app/core/services/canvas-standards/canvas-standards.service';
import { CoursesService } from 'src/app/core/services/courses/courses.service';
import { combineLatest, of, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CanvasStandard } from 'src/app/core/models/canvas-standard';
import { FormBuilder, Validators } from '@angular/forms';
import { StandardsService } from 'src/app/core/services/standards/standards.service';

@Component({
  selector: 'app-canvas-standards',
  templateUrl: './canvas-standards.component.html',
  styleUrls: ['./canvas-standards.component.css']
})
export class CanvasStandardsComponent implements OnInit {
  importForm;
  activeCourse;
  courses$ = this.coursesService.courses$;
  outcomes = new BehaviorSubject([]);
  outcomes$ : Observable<CanvasStandard[]> = this.outcomes.asObservable();

  removeStandardsAction = new BehaviorSubject<number[]>([]);
  removeStandardsAction$ = this.removeStandardsAction.asObservable();

  displayedOutcomes$ = combineLatest(
    [this.outcomes$,
    this.removeStandardsAction$]
  ).pipe(map(([outcomes, remove]) => {
    outcomes = outcomes.filter(o => !remove.includes(o.id));
    return (outcomes);
  }));  

  constructor(
    public canvasStandardsService : CanvasStandardsService,
    public coursesService : CoursesService,
    private standardsService : StandardsService,
    private fb : FormBuilder,
  ) { }

  ngOnInit(): void {
    this.setImportForm();
  }

  setImportForm() {
    this.importForm = this.fb.group({
      name: ['', Validators.required],
      course: [this.activeCourse],
    })
  }

  setActiveCourse(id) {
    this.activeCourse = id;
    this.removeStandardsAction.next([]);
    this.outcomes.next([]);
    this.canvasStandardsService.getOutcomeGroups(id)
      .pipe(map(groups => {
        for (let group of groups) {
          let outcome = this.canvasStandardsService.getOutcomes(group.outcome.url)
            .pipe(map(o => {
              return {
                id : o.id,
                category : group.outcome_group.title,
                name : o.title,
                description : o.description.replace( /(<([^>]+)>)/ig, '')
              }
            }));
          let standards = this.outcomes.value;
          outcome.subscribe(o => {
            standards.push(o);
            this.outcomes.next(standards.sort(this.sortStandards));
          });
        }
      })).subscribe(() => {
        return;
      },
      error => {
        alert(error.message);
      })
  }

  removeStandard(standard) {
    let removed = this.removeStandardsAction.value;
    removed.push(standard.id);
    this.removeStandardsAction.next(removed);
  }

  sortStandards(a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    let comparison = 0;
    (nameA > nameB) ? comparison = 1 : comparison = -1;
    return comparison;
  }

  importAll(outcomes) {
    let formData = this.importForm.value;
    let allCats : string[] = outcomes.map(c => c.category);
    let categories : string[] = [...new Set(allCats)];
    let newGroup$ = this.standardsService.createStandardsGroup({ name : formData.name, categories: categories })
      .pipe(map(ref => {
        // Retrieve new standards group id and save standards to DB
        let id = ref.key;
        for (let outcome of outcomes) {
          delete outcome.id;
          outcome.essential = false;
          outcome.group = id;
          this.standardsService.createStandard(outcome).subscribe();
        };
        return id;
      }));
    combineLatest(
      [newGroup$,
      this.courses$]
    ).pipe(map(([newStandardsGroup, courses]) => {
      // Associate newly created group with all sections under course ID
      let groupID = newStandardsGroup;
      courses = courses.filter(c => c.courseID == formData.course);
      for (let course of courses) {
        this.coursesService.updateCourse({ standardsID : groupID }, course.id).subscribe();
      };
      return ({groupID, courses});
    })).subscribe(() => {
      return;
    },
    error => {
      alert(error.message);
    })
    alert("The standards were imported successfully.");
  }
}
