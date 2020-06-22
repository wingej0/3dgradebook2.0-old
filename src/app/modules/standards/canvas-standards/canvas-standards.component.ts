import { Component, OnInit } from '@angular/core';
import { CanvasStandardsService } from 'src/app/core/services/canvas-standards/canvas-standards.service';
import { CoursesService } from 'src/app/core/services/courses/courses.service';
import { combineLatest, of, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CanvasStandard } from 'src/app/core/models/canvas-standard';

@Component({
  selector: 'app-canvas-standards',
  templateUrl: './canvas-standards.component.html',
  styleUrls: ['./canvas-standards.component.css']
})
export class CanvasStandardsComponent implements OnInit {
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
    public coursesService : CoursesService
  ) { }

  ngOnInit(): void {
  }

  setActiveCourse(id) {
    this.removeStandardsAction.next([]);
    this.outcomes.next([]);
    let categories = [];
    this.canvasStandardsService.getOutcomeGroups(id)
      .pipe(map(groups => {
        for (let group of groups) {
          categories.push(group.outcome_group.title);
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
          console.log(standards);
          outcome.subscribe(o => {
            standards.push(o);
            this.outcomes.next(standards);
          });
        }
      })).subscribe()
  }

  removeStandard(standard) {
    let removed = this.removeStandardsAction.value;
    removed.push(standard.id);
    this.removeStandardsAction.next(removed);
  }

}
