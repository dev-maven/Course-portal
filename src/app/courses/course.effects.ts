import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {CoursesService} from "./services/courses.service";
import {AllCoursesLoaded, AllCoursesRequested, CourseActionTypes, CourseLoaded, CourseRequested} from "./course.action";
import {map, mergeMap, withLatestFrom, filter} from "rxjs/operators";
import {AppState} from "../reducers";
import {select, Store} from "@ngrx/store";
import {allCoursesLoaded} from "./course.selector";


@Injectable()
export class CourseEffects {

  @Effect()
  loadCourse$ = this.actions$
    .pipe(
      ofType<CourseRequested>(CourseActionTypes.CourseRequested),
      mergeMap(action => this.coursesService.findCourseById(action.payload.courseId)),
      map(course => new CourseLoaded({course})),

    );

  @Effect()
  loadAllCourses$ = this.actions$
    .pipe(
      ofType<AllCoursesRequested>(CourseActionTypes.AllCoursesRequested),
      withLatestFrom(this.store.pipe(select(allCoursesLoaded))),
      filter(([action, allCoursesLoaded]) => !allCoursesLoaded),
      mergeMap(action => this.coursesService.findAllCourses()),
      map(courses => new AllCoursesLoaded({courses}))
    );

  constructor(private actions$: Actions, private coursesService: CoursesService, private store: Store<AppState>) {

  }
}
