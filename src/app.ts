import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { PageComponent } from './components/page/page.js';

class App {
  private readonly page: PageComponent;

  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attatchTo(appRoot);

    const image = new ImageComponent(
      'Image Title',
      'https://picsum.photos/600/300'
    );
    image.attatchTo(appRoot, 'beforeend');

    const video = new VideoComponent(
      'Video Title',
      'https://youtu.be/dG6AcrSSKlQ'
    );
    video.attatchTo(appRoot, 'beforeend');

    const note = new NoteComponent('Note Title', 'Hello World :)');
    note.attatchTo(appRoot, 'beforeend');

    const todo = new TodoComponent('Todo Title', 'English');
    todo.attatchTo(appRoot, 'beforeend');
  }
}

// !와 as를 함께 쓰는 이유는?
new App(document.querySelector('.document')! as HTMLElement);
