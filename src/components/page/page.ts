import { BaseComponent, Component } from '../component.js';

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

type DragState = 'start' | 'end' | 'enter' | 'leave';
type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;

interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: 'mute' | 'unmute'): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}
type SectionContainerConstructor = {
  new (): SectionContainer;
};

export class PageItemComponent
  extends BaseComponent<HTMLHtmlElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;
  constructor() {
    super(`<li class="page-item" draggable="true">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);

    this.element.addEventListener('dragstart', (event: DragEvent) => {
      this.onDragStart(event);
      this.element.classList.add('dragged');
    });

    this.element.addEventListener('dragend', (event: DragEvent) => {
      this.onDragEnd(event);
      this.element.classList.remove('dragged');
    });

    this.element.addEventListener('dragenter', (event: DragEvent) => {
      this.onDragEnter(event);
      this.element.classList.add('drop-area');
    });

    this.element.addEventListener('dragleave', (event: DragEvent) => {
      this.onDragLeave(event);
      this.element.classList.remove('drop-area');
    });

    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
  }

  onDragStart(_: DragEvent) {
    this.notifyDragObservers('start');
  }

  onDragEnd(_: DragEvent) {
    this.notifyDragObservers('end');
  }

  onDragEnter(_: DragEvent) {
    this.notifyDragObservers('enter');
  }

  onDragLeave(_: DragEvent) {
    this.notifyDragObservers('leave');
  }

  onDropped() {
    this.element.classList.remove('drop-area');
  }

  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }

  addChild(child: Component) {
    const container = this.element.querySelector(
      '.page-item__body'
    )! as HTMLElement;
    child.attatchTo(container);
  }

  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }

  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }

  muteChildren(state: 'mute' | 'unmute') {
    if (state === 'mute') {
      this.element.classList.add('mute-children');
    } else {
      this.element.classList.remove('mute-children');
    }
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}

export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  private children = new Set<SectionContainer>();
  private dropTarget?: SectionContainer;
  private dragTarget?: SectionContainer;

  constructor(private PageItemConstructor: SectionContainerConstructor) {
    super('<ul calss="page"></ul>');
    this.element.addEventListener('dragover', (event: DragEvent) => {
      this.onDragOver(event);
    });

    this.element.addEventListener('drop', (event: DragEvent) => {
      this.onDrop(event);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();

    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();
      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attatch(
        this.dragTarget,
        dropY < srcElement.y ? 'beforebegin' : 'afterend'
      );
    }
    this.dropTarget.onDropped();
  }

  addChild(section: Component) {
    const item = new this.PageItemConstructor();
    item.addChild(section);
    item.attatchTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        switch (state) {
          case 'start':
            this.dragTarget = target;
            this.updateSections('mute');
            break;
          case 'end':
            this.dragTarget = undefined;
            this.updateSections('unmute');
            break;
          case 'enter':
            console.log('enter', target);
            this.dropTarget = target;
            break;
          case 'leave':
            console.log('leave', target);
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state: ${state}`);
        }
      }
    );
  }

  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
