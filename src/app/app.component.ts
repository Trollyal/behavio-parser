import { Component, OnDestroy, Pipe, PipeTransform } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { SexpNode, SexpParserService } from 'src/services/sexpParser.service'
import { debounceTime, filter, map, shareReplay, tap } from 'rxjs/operators'

import { ErrorStateMatcher } from '@angular/material/core'
import { FormControl } from '@angular/forms'
import { MatTreeNestedDataSource } from '@angular/material/tree'
import { NestedTreeControl } from '@angular/cdk/tree'

export class FieldStateMatcher implements ErrorStateMatcher {
  hasError: boolean

  isErrorState(): boolean {
    return this.hasError
  }

  constructor(hasError: boolean) {
    this.hasError = hasError
  }
}

@Pipe({
  name: 'nodeName',
  pure: true
})
export class NodeNamePipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') return value
    return value[0]
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnDestroy {

  sexpInput: FormControl = new FormControl('')

  /** Parsed input data with 500ms debounce */
  parsedData$: Observable<SexpNode[] | Error> = this.sexpInput.valueChanges.pipe(
    debounceTime(500),
    map((value) => this._sexpParser.parse(`(${value})`)),
    shareReplay()
  )

  /** Parsed data mapped into data source for material tree component */
  dataSource$ = this.parsedData$.pipe(
    filter((data) => !(data instanceof Error)),
    map((data) => {
      const source = new MatTreeNestedDataSource<SexpNode>()
      source.data = data as SexpNode[]

      return source
    }),
    tap((source) => {
      this.treeControl.dataNodes = source.data
      this.treeControl.expandAll()
    })
  )

  /** Parse error */
  error$ = this.parsedData$.pipe(
    filter((data) => data instanceof Error)
  )
  /** Has parsing thrown error */
  parsedWithError$ = this.parsedData$.pipe(
    map((data) => data instanceof Error)
  )

  treeControl = new NestedTreeControl<SexpNode>(node => typeof node === 'string' || node.length < 2 ? [] : node.slice(1));
  fieldMatcher = new FieldStateMatcher(false)

  private _errorSubscription: Subscription

  constructor(private _sexpParser: SexpParserService) {
    this._errorSubscription = this.parsedWithError$.subscribe((isError) => {
      this.fieldMatcher = new FieldStateMatcher(isError)
    })
  }

  hasChild(_: number, node: SexpNode) {
    return typeof node === 'object' && node.length > 0
  }

  ngOnDestroy() {
    this._errorSubscription.unsubscribe()
  }
}
