export interface Component {
  attatchTo(parent: HTMLElement, position?: InsertPosition): void;
}

/**
 * Encapsulate the HTML element creation
 */
export class BaseComponent<T extends HTMLElement> implements Component {
  protected readonly element: T;

  constructor(htmlString: string) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    this.element = template.content.firstElementChild! as T;
  }

  attatchTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element);
  }
}
