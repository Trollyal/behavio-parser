import { Injectable } from '@angular/core'
import SParser from 's-expression'

export type SexpNode = string | Array<string | SexpNode>

@Injectable()
export class SexpParserService {

  parse(input: string): SexpNode[] | Error {
    return SParser(input)
  }
}