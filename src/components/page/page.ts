import { BaseComponent } from '../component.js';

export class PageComponent extends BaseComponent<HTMLUListElement> {
  constructor() {
    super('<ul calss="page">This is PageComponent</ul>');
  }
}
